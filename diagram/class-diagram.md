# Class Diagram

Mermaid class diagrams for the SBNZ concussion-protocol project, grouped by concern. Open this file in any Mermaid-aware renderer (GitHub, GitLab, VS Code preview with the *Markdown Preview Mermaid Support* extension) to see the visuals.

---

## 1. Domain model

The core mutable state — what gets registered when a doctor creates a new athlete, and the only fact in the engine that ever gets `modify($a)`-ed.

```mermaid
classDiagram
    class Athlete {
        -id: String
        -name: String
        -age: int
        -sex: Sex
        -sport: String
        -position: String
        -competitionLevel: String
        -contactLevel: ContactLevel
        -historyFlag: HistoryFlag
        -riskFactors: RiskFactors
        -previousConcussions: List~PreviousConcussion~
        -baselineSymptoms: Map~String,Integer~
        -currentStep: int
        -stepEnteredAt: LocalDateTime
        -injuryAt: LocalDateTime
        +baselineFor(symptom: String) int
        +cisgFactorCount() int
        +recurrenceWindowHours() int
        +dwellBonusHours() int
    }

    class RiskFactors {
        -migraine: boolean
        -adhd: boolean
        -anxiety: boolean
        -learningDifficulties: boolean
        -mentalHealthHistory: boolean
        -sleepDisorder: boolean
    }

    class PreviousConcussion {
        -date: LocalDate
        -recoveryDays: int
    }

    class Sex {
        <<enumeration>>
        MALE
        FEMALE
        OTHER
    }

    class ContactLevel {
        <<enumeration>>
        CONTACT
        NONCONTACT
    }

    class HistoryFlag {
        <<enumeration>>
        NONE
        SINGLE
        MULTIPLE
    }

    Athlete "1" *-- "1" RiskFactors : embeds
    Athlete "1" *-- "0..*" PreviousConcussion : has
    Athlete --> Sex
    Athlete --> ContactLevel
    Athlete --> HistoryFlag
```

`Athlete.cisgFactorCount()` counts the `true` flags on `RiskFactors`. `recurrenceWindowHours()` returns 24/36/48 based on that count; `dwellBonusHours()` returns 0/12/24. Both are read directly from rules in [ExertionPattern.drl](../kjar/src/main/resources/rules/cep/ExertionPattern.drl) and [ReadinessQuery.drl](../kjar/src/main/resources/rules/fc/ReadinessQuery.drl).

---

## 2. Events (CEP — time-stamped inputs)

All event classes annotated `@Role(EVENT)` + `@Timestamp("timestamp")` + `@Expires(...)` so Drools tracks them in stream mode. They share an `athleteId` join key but don't inherit from a common base — Drools doesn't need them to.

```mermaid
classDiagram
    class SymptomReportedEvent {
        <<event>>
        -athleteId: String
        -symptom: String
        -level: int
        -timestamp: Date
    }
    class SymptomDuringExertionEvent {
        <<event>>
        -athleteId: String
        -symptom: String
        -delta: int
        -durationMinutes: int
        -timestamp: Date
    }
    class ExertionAttemptEvent {
        <<event>>
        -athleteId: String
        -activity: String
        -timestamp: Date
    }
    class StepAdvancementEvent {
        <<event>>
        -athleteId: String
        -fromStep: int
        -toStep: int
        -timestamp: Date
    }
    class MedicalClearanceEvent {
        <<event>>
        -athleteId: String
        -clearanceForStep: int
        -physicianId: String
        -note: String
        -timestamp: Date
    }
    class ObjectiveTestEvent {
        <<event>>
        -athleteId: String
        -testType: String
        -value: double
        -timestamp: Date
    }
```

Annotations on each event class:
- `@Role(Role.Type.EVENT)`
- `@Timestamp("timestamp")` — names the field Drools uses for windowing/temporal operators
- `@Expires(...)` — auto-retraction window. SymptomDuringExertion/Attempt/Advancement = `30d`; SymptomReported = `60d`; MedicalClearance/ObjectiveTest = `365d`.

---

## 3. Derived facts (rule outputs)

What the engine inserts as it reasons over events + profile. None of these are events — they're regular facts with `athleteId` as the join key. The engine retracts a few of them (`ExertionIntoleranceFlag`, `EmergencyAlert`) when their producing conditions cease to hold.

```mermaid
classDiagram
    class MoreThanMildExacerbation {
        -athleteId: String
        -symptom: String
        -delta: int
        -durationMinutes: int
    }
    class ExertionIntoleranceFlag {
        -athleteId: String
        -reason: String
    }
    class RegressTrigger {
        -athleteId: String
        -reason: String
    }
    class PersistingSymptomsFlag {
        -athleteId: String
        -reason: String
    }
    class CervicovestibularRehabIndication {
        -athleteId: String
        -reason: String
    }
    class IndividualizedAssessmentRequired {
        -athleteId: String
        -reason: String
    }
    class EmergencyAlert {
        -athleteId: String
        -flagType: RedFlagType
        -severity: Severity
        -actionType: String
        -message: String
        -insertedAt: Date
    }
    class ActivityBlockedAlert {
        -athleteId: String
        -activity: String
        -currentStep: int
        -message: String
    }
    class ProgressionStatusFact {
        -athleteId: String
        -status: ProgressionStatus
        -reason: String
    }
    class StepRecommendation {
        -athleteId: String
        -action: ActionType
        -currentStep: int
        -recommendedStep: int
        -retryAfterHours: int
        -explanation: String
    }
    class ProtocolLockEvent {
        -athleteId: String
        -lockUntilHours: int
        -reason: String
        -lockedAt: Date
    }
    class ParentCategory {
        -child: String
        -parent: String
    }
    class AllowedActivity {
        -step: int
        -allowedCategory: String
        -sourceCitation: String
    }
    class MinStepDwellRule {
        -athleteId: String
        -minHours: int
    }

    class ProgressionStatus {
        <<enumeration>>
        STOP_TODAY_RETRY_TOMORROW
        REGRESS_TO_STEP_3
    }
    class ActionType {
        <<enumeration>>
        ADVANCE
        HOLD
        REGRESS
        STOP_AND_RETRY
        FREEZE
    }
    class RedFlagType {
        <<enumeration>>
        LOSS_OF_CONSCIOUSNESS
        SEIZURE
        DETERIORATING_CONSCIOUSNESS
        WEAKNESS_IN_LIMBS
        VISIBLE_SKULL_DEFORMITY
        SEVERE_HEADACHE
        REPEATED_VOMITING
        DOUBLE_VISION
        NECK_PAIN
        AGITATION
    }
    class Severity {
        <<enumeration>>
        CRITICAL
        HIGH
        MEDIUM
    }

    ProgressionStatusFact --> ProgressionStatus
    StepRecommendation --> ActionType
    EmergencyAlert --> RedFlagType
    EmergencyAlert --> Severity
```

---

## 4. Causality between events and derived facts

How each derived fact gets produced. Arrows go *from input to output* of a rule.

```mermaid
classDiagram
    class SymptomDuringExertionEvent
    class SymptomReportedEvent
    class StepAdvancementEvent
    class ExertionAttemptEvent
    class Athlete

    class MoreThanMildExacerbation
    class ExertionIntoleranceFlag
    class RegressTrigger
    class PersistingSymptomsFlag
    class CervicovestibularRehabIndication
    class IndividualizedAssessmentRequired
    class EmergencyAlert
    class ActivityBlockedAlert
    class ProgressionStatusFact
    class StepRecommendation
    class ProtocolLockEvent
    class MinStepDwellRule
    class AllowedActivity

    SymptomDuringExertionEvent ..> MoreThanMildExacerbation : "More than mild exacerbation"
    SymptomDuringExertionEvent ..> ExertionIntoleranceFlag : "Exertion intolerance pattern (accumulate over 48h)"
    StepAdvancementEvent ..> RegressTrigger : "Exertion exacerbation after step advancement"
    SymptomDuringExertionEvent ..> RegressTrigger
    SymptomReportedEvent ..> CervicovestibularRehabIndication : "≥10 days post-injury"
    SymptomReportedEvent ..> PersistingSymptomsFlag : "≥4 weeks post-injury"
    SymptomReportedEvent ..> EmergencyAlert : "RedFlagSeverity template (10 rules)"
    Athlete ..> IndividualizedAssessmentRequired : "MULTIPLE history OR CISG cluster"
    Athlete ..> MinStepDwellRule : "MinStepDwell template (6 rules per profile)"
    Athlete ..> AllowedActivity : "AllowedActivity template (8 rules at boot)"
    ExertionAttemptEvent ..> ActivityBlockedAlert : "outside allowed top category"

    ExertionIntoleranceFlag ..> ProgressionStatusFact : "Determine status STOP_AND_RETRY / REGRESS"
    RegressTrigger ..> ProgressionStatusFact
    ProgressionStatusFact ..> StepRecommendation : "Recommend HOLD / REGRESS (salience -10)"
    ProgressionStatusFact ..> ProtocolLockEvent

    MedicalClearanceEvent ..> EmergencyAlert : "retracts pre-clearance alerts"
    class MedicalClearanceEvent
```

The three-level FC chain on the right side of this graph (`ExertionIntoleranceFlag` / `RegressTrigger` → `ProgressionStatusFact` → `StepRecommendation`) is what satisfies the "≥3 levels" grading requirement.

---

## 5. Template DTOs

Plain POJOs that mirror CSV row schemas; `KnowledgeService.compileTemplate` parses CSV rows into these, then hands the list to Drools' `ObjectDataCompiler`.

```mermaid
classDiagram
    class MinStepDwellTemplate {
        -contactLevel: String
        -historyFlag: String
        -minHours: int
    }
    class AllowedActivityTemplate {
        -step: int
        -allowedCategory: String
        -sourceCitation: String
    }
    class RedFlagSeverityTemplate {
        -flagType: String
        -severity: String
        -salienceLevel: int
        -actionType: String
    }
```

Each row becomes one generated rule, written into a synthetic `.drl` and compiled into the kbase alongside the hand-written rules.

---

## 6. Service layer

Spring beans that wire up Drools and expose REST endpoints. `KnowledgeService` owns the `KieContainer` and per-athlete sessions; `ProtocolService` is the orchestrator that every REST event handler funnels through.

```mermaid
classDiagram
    class KieServices {
        <<Drools API>>
    }
    class KieContainer {
        <<Drools API>>
        +newKieSession(name, config) KieSession
    }
    class KieSession {
        <<Drools API>>
        +insert(fact) FactHandle
        +fireAllRules() int
        +getQueryResults(name, args) QueryResults
    }

    class DroolsConfig {
        +kieServices() KieServices
    }

    class KnowledgeService {
        -container: KieContainer
        -sessions: Map~String, KieSession~
        -athletes: Map~String, Athlete~
        -templateCsvOverrides: Map~String, String~
        +getSessionFor(athleteId) KieSession
        +registerAthlete(athlete)
        +getAthlete(id) Athlete
        +listAthletes() List~Athlete~
        +updateTemplateCsv(name, csv)
        +getTemplateCsv(name) String
        -buildContainer() KieContainer
        -compileTemplate(drt, csv, parser) String
        -seedActivityTree(session)
    }

    class ProtocolService {
        -knowledge: KnowledgeService
        -audit: AuditService
        -dailyChecks: Map
        +reportSymptom(ev) int
        +reportSymptomDuringExertion(ev) int
        +reportExertionAttempt(ev) int
        +reportStepAdvancement(ev) int
        +reportMedicalClearance(ev) int
        +submitDailyCheck(athleteId, levels) DailyCheckRecord
        +readyToAdvance(aid, targetStep) ReadinessResult
        +allowedActivitiesForCurrentStep(aid) Set~String~
        +estimateEarliestReturn(aid) Map
        +getRecommendations(aid) List~StepRecommendation~
        +getAlerts(aid) List~EmergencyAlert~
        +getExertionIntoleranceFlags(aid) List
        +getRegressTriggers(aid) List
        +getPersistingSymptoms(aid) List
        +getCervicovestibularIndications(aid) List
        +getIndividualizedAssessments(aid) List
        +getLocks(aid) List
        +getSymptomHistory(aid) List
    }

    class AuditService {
        +attach(athleteId, session) Recorder
        +record(athleteId, trigger, actor, recorder, timestamp)
        +getLog(athleteId) List
    }

    class DemoAthleteSeed {
        +seed() void
    }

    DroolsConfig ..> KieServices : produces bean
    KnowledgeService ..> KieServices : uses
    KnowledgeService "1" --> "1" KieContainer : holds
    KnowledgeService "1" --> "*" KieSession : one per athlete
    KnowledgeService "1" --> "*" Athlete : caches profiles
    ProtocolService --> KnowledgeService
    ProtocolService --> AuditService
    AuditService ..> KieSession : attaches AgendaEventListener
    DemoAthleteSeed --> KnowledgeService
    DemoAthleteSeed --> ProtocolService
```

---

## 7. REST controllers

Thin HTTP layer; almost every method delegates to `ProtocolService` or `KnowledgeService`.

```mermaid
classDiagram
    class AthleteController {
        +list() List~Athlete~
        +get(id) Athlete
        +register(body) Athlete
        +dashboard(id) Map
        +symptomHistory(id) Object
        +dailyCheckToday(id) Map
        +estimatedReturn(id) Map
        +allowedActivities(id) Map
        +readyToAdvance(id, targetStep) Object
    }
    class EventController {
        +symptom(ev) Map
        +exertionAttempt(ev) Map
        +symptomDuringExertion(ev) Map
        +stepAdvancement(ev) Map
        +medicalClearance(ev) Map
        +objectiveTest(ev) Map
    }
    class ReportController {
        +byStep() Map
        +bySport() Map
        +avgRecoveryDays() Map
        +riskSummary() List
        +adherence(id) Map
    }
    class TemplateController {
        +list() List~String~
        +get(name) String
        +update(name, csv) Map
    }
    class AuditController {
        +get(athleteId) List
    }
    class AuthController {
        +login(req) Map
        +registerAthleteAccount(req) Map
    }

    AthleteController --> ProtocolService
    AthleteController --> KnowledgeService
    EventController --> ProtocolService
    ReportController --> ProtocolService
    ReportController --> KnowledgeService
    TemplateController --> KnowledgeService
    AuditController --> AuditService
    AuthController --> UserStore
    AuthController --> JwtUtil

    class UserStore
    class JwtUtil
```

---

## 8. Auth (lightweight)

Self-contained JWT setup. No DB; users live in an in-memory `UserStore`.

```mermaid
classDiagram
    class User {
        -username: String
        -passwordHash: String
        -role: Role
        -displayName: String
        -athleteId: String
    }
    class Role {
        <<enumeration>>
        DOCTOR
        ADMIN
        ATHLETE
    }
    class UserStore {
        -users: Map~String, User~
        +register(user)
        +find(username) Optional~User~
        +list() List~User~
    }
    class JwtUtil {
        +issue(user) String
        +parse(token) Claims
        +roleOf(claims) Role
    }
    class JwtFilter {
        <<Spring filter>>
        +doFilterInternal(req, res, chain)
    }
    class SecurityConfig {
        +securityFilterChain(http) SecurityFilterChain
        +passwordEncoder() PasswordEncoder
    }

    User --> Role
    UserStore "1" --> "*" User
    JwtUtil ..> User
    JwtFilter --> JwtUtil
    JwtFilter --> UserStore
    SecurityConfig --> JwtFilter
```
