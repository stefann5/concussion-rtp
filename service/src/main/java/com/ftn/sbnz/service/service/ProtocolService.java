package com.ftn.sbnz.service.service;

import com.ftn.sbnz.model.domain.Athlete;
import com.ftn.sbnz.model.events.ExertionAttemptEvent;
import com.ftn.sbnz.model.events.MedicalClearanceEvent;
import com.ftn.sbnz.model.events.ObjectiveTestEvent;
import com.ftn.sbnz.model.events.StepAdvancementEvent;
import com.ftn.sbnz.model.events.SymptomDuringExertionEvent;
import com.ftn.sbnz.model.events.SymptomReportedEvent;
import com.ftn.sbnz.model.facts.ActivityBlockedAlert;
import com.ftn.sbnz.model.facts.CervicovestibularRehabIndication;
import com.ftn.sbnz.model.facts.EmergencyAlert;
import com.ftn.sbnz.model.facts.ExertionIntoleranceFlag;
import com.ftn.sbnz.model.facts.MoreThanMildExacerbation;
import com.ftn.sbnz.model.facts.PersistingSymptomsFlag;
import com.ftn.sbnz.model.facts.ProgressionStatusFact;
import com.ftn.sbnz.model.facts.ProtocolLockEvent;
import com.ftn.sbnz.model.facts.RegressTrigger;
import com.ftn.sbnz.model.facts.MinStepDwellRule;
import com.ftn.sbnz.model.facts.StepRecommendation;
import com.ftn.sbnz.service.audit.AuditService;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.QueryResults;
import org.kie.api.runtime.rule.QueryResultsRow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ProtocolService {

    private final KnowledgeService knowledge;
    private final AuditService audit;

    public static class DailyCheckRecord {
        public LocalDateTime submittedAt;
        public Map<String, Integer> levels;
        public DailyCheckRecord(LocalDateTime at, Map<String, Integer> levels) {
            this.submittedAt = at; this.levels = levels;
        }
    }

    private final Map<String, Map<LocalDate, DailyCheckRecord>> dailyChecks = new ConcurrentHashMap<>();

    @Autowired
    public ProtocolService(KnowledgeService knowledge, AuditService audit) {
        this.knowledge = knowledge;
        this.audit = audit;
    }

    private String currentActor() {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) return "system";
            Object p = auth.getPrincipal();
            if (p instanceof com.ftn.sbnz.service.auth.JwtFilter.AuthPrincipal ap) return ap.username();
            return auth.getName();
        } catch (Exception e) { return "system"; }
    }

    public int reportSymptom(SymptomReportedEvent ev) {
        ensureTimestamp(ev::getTimestamp, ev::setTimestamp);
        KieSession s = knowledge.getSessionFor(ev.getAthleteId());
        AuditService.Recorder rec = audit.attach(ev.getAthleteId(), s);
        s.insert(ev);
        int fired = s.fireAllRules();
        audit.record(ev.getAthleteId(),
                "SymptomReported(" + ev.getSymptom() + "=" + ev.getLevel() + ")",
                currentActor(), rec, ev.getTimestamp());
        return fired;
    }

    public boolean hasDailyCheckToday(String athleteId) {
        return getTodaysDailyCheck(athleteId) != null;
    }

    public DailyCheckRecord getTodaysDailyCheck(String athleteId) {
        Map<LocalDate, DailyCheckRecord> per = dailyChecks.get(athleteId);
        if (per == null) return null;
        return per.get(LocalDate.now());
    }

    public DailyCheckRecord submitDailyCheck(String athleteId, Map<String, Integer> levels) {
        LocalDate today = LocalDate.now();
        Map<LocalDate, DailyCheckRecord> per = dailyChecks.computeIfAbsent(athleteId, k -> new ConcurrentHashMap<>());
        if (per.containsKey(today)) {
            throw new IllegalStateException("Daily check already submitted today");
        }
        Map<String, Integer> snapshot = new LinkedHashMap<>();
        levels.forEach((sym, lvl) -> snapshot.put(sym, lvl == null ? 0 : lvl));
        DailyCheckRecord record = new DailyCheckRecord(LocalDateTime.now(), snapshot);
        per.put(today, record);
        snapshot.forEach((sym, lvl) -> {
            if (lvl > 0) reportSymptom(new SymptomReportedEvent(athleteId, sym, lvl, null));
        });
        return record;
    }

    public int reportExertionAttempt(ExertionAttemptEvent ev) {
        ensureTimestamp(ev::getTimestamp, ev::setTimestamp);
        KieSession s = knowledge.getSessionFor(ev.getAthleteId());
        AuditService.Recorder rec = audit.attach(ev.getAthleteId(), s);
        s.insert(ev);
        int fired = s.fireAllRules();
        audit.record(ev.getAthleteId(), "ExertionAttempt(" + ev.getActivity() + ")",
                currentActor(), rec, ev.getTimestamp());
        return fired;
    }

    public int reportSymptomDuringExertion(SymptomDuringExertionEvent ev) {
        ensureTimestamp(ev::getTimestamp, ev::setTimestamp);
        KieSession s = knowledge.getSessionFor(ev.getAthleteId());
        AuditService.Recorder rec = audit.attach(ev.getAthleteId(), s);
        s.insert(ev);
        int fired = s.fireAllRules();
        audit.record(ev.getAthleteId(),
                "SymptomDuringExertion(" + ev.getSymptom() + " +" + ev.getDelta() + ")",
                currentActor(), rec, ev.getTimestamp());
        return fired;
    }

    public int recordStepAdvancement(StepAdvancementEvent ev) {
        ensureTimestamp(ev::getTimestamp, ev::setTimestamp);
        Athlete a = knowledge.getAthlete(ev.getAthleteId());
        if (a != null) {
            a.setCurrentStep(ev.getToStep());
            a.setStepEnteredAt(LocalDateTime.now());
        }
        KieSession s = knowledge.getSessionFor(ev.getAthleteId());
        AuditService.Recorder rec = audit.attach(ev.getAthleteId(), s);
        for (Object o : new ArrayList<>(s.getObjects(o -> o instanceof Athlete && ((Athlete) o).getId().equals(ev.getAthleteId())))) {
            s.delete(s.getFactHandle(o));
        }
        s.insert(a);
        s.insert(ev);
        int fired = s.fireAllRules();
        audit.record(ev.getAthleteId(), "StepAdvancement(" + ev.getFromStep() + "->" + ev.getToStep() + ")", currentActor(), rec);
        return fired;
    }

    public int recordMedicalClearance(MedicalClearanceEvent ev) {
        ensureTimestamp(ev::getTimestamp, ev::setTimestamp);
        KieSession s = knowledge.getSessionFor(ev.getAthleteId());
        AuditService.Recorder rec = audit.attach(ev.getAthleteId(), s);
        s.insert(ev);
        int fired = s.fireAllRules();
        audit.record(ev.getAthleteId(), "MedicalClearance(step " + ev.getClearanceForStep() + ")", currentActor(), rec);
        return fired;
    }

    public int recordObjectiveTest(ObjectiveTestEvent ev) {
        ensureTimestamp(ev::getTimestamp, ev::setTimestamp);
        KieSession s = knowledge.getSessionFor(ev.getAthleteId());
        AuditService.Recorder rec = audit.attach(ev.getAthleteId(), s);
        s.insert(ev);
        int fired = s.fireAllRules();
        audit.record(ev.getAthleteId(), "ObjectiveTest(" + ev.getTestType() + "=" + ev.getValue() + ")", currentActor(), rec);
        return fired;
    }

    public List<StepRecommendation> getRecommendations(String aid) {
        return queryFacts(aid, StepRecommendation.class, sr -> sr.getAthleteId().equals(aid));
    }

    public List<EmergencyAlert> getAlerts(String aid) {
        return queryFacts(aid, EmergencyAlert.class, ea -> ea.getAthleteId().equals(aid));
    }

    public List<ActivityBlockedAlert> getActivityBlocks(String aid) {
        return queryFacts(aid, ActivityBlockedAlert.class, ea -> ea.getAthleteId().equals(aid));
    }

    public List<ProgressionStatusFact> getProgressionStatuses(String aid) {
        return queryFacts(aid, ProgressionStatusFact.class, p -> p.getAthleteId().equals(aid));
    }

    public List<ExertionIntoleranceFlag> getExertionIntoleranceFlags(String aid) {
        return queryFacts(aid, ExertionIntoleranceFlag.class, f -> f.getAthleteId().equals(aid));
    }

    public List<RegressTrigger> getRegressTriggers(String aid) {
        return queryFacts(aid, RegressTrigger.class, f -> f.getAthleteId().equals(aid));
    }

    public List<MoreThanMildExacerbation> getExacerbations(String aid) {
        return queryFacts(aid, MoreThanMildExacerbation.class, f -> f.getAthleteId().equals(aid));
    }

    public List<PersistingSymptomsFlag> getPersistingSymptoms(String aid) {
        return queryFacts(aid, PersistingSymptomsFlag.class, f -> f.getAthleteId().equals(aid));
    }

    public List<CervicovestibularRehabIndication> getCervicovestibularIndications(String aid) {
        return queryFacts(aid, CervicovestibularRehabIndication.class, f -> f.getAthleteId().equals(aid));
    }

    public List<ProtocolLockEvent> getLocks(String aid) {
        return queryFacts(aid, ProtocolLockEvent.class, f -> f.getAthleteId().equals(aid));
    }

    public List<com.ftn.sbnz.model.facts.PediatricRtlPending> getPediatricRtl(String aid) {
        return queryFacts(aid, com.ftn.sbnz.model.facts.PediatricRtlPending.class, f -> f.getAthleteId().equals(aid));
    }

    public List<com.ftn.sbnz.model.facts.IndividualizedAssessmentRequired> getIndividualizedAssessments(String aid) {
        return queryFacts(aid, com.ftn.sbnz.model.facts.IndividualizedAssessmentRequired.class, f -> f.getAthleteId().equals(aid));
    }

    public List<SymptomReportedEvent> getSymptomHistory(String aid) {
        KieSession s = knowledge.getSessionFor(aid);
        List<SymptomReportedEvent> out = new ArrayList<>();
        for (Object o : s.getObjects(o -> o instanceof SymptomReportedEvent && ((SymptomReportedEvent) o).getAthleteId().equals(aid))) {
            out.add((SymptomReportedEvent) o);
        }
        out.sort((a, b) -> a.getTimestamp().compareTo(b.getTimestamp()));
        return out;
    }

    public ReadinessResult readyToAdvance(String aid, int targetStep) {
        KieSession s = knowledge.getSessionFor(aid);
        s.fireAllRules();
        QueryResults res = s.getQueryResults("readyToAdvance", aid, targetStep);
        boolean ready = res.iterator().hasNext();
        Athlete a = knowledge.getAthlete(aid);
        List<String> missing = new ArrayList<>();
        if (a == null) {
            missing.add("Athlete profile not found");
            return new ReadinessResult(false, missing);
        }
        if (targetStep < 2 || targetStep > 6) {
            missing.add("Target step must be between 2 and 6");
        }
        if (a.getCurrentStep() != targetStep - 1) {
            missing.add("Athlete is on step " + a.getCurrentStep() + ", can only advance to step " + (a.getCurrentStep() + 1));
        }

        Integer baseHours = null;
        for (Object o : s.getObjects(o -> o instanceof MinStepDwellRule && ((MinStepDwellRule) o).getAthleteId().equals(aid))) {
            baseHours = ((MinStepDwellRule) o).getMinHours();
        }
        if (baseHours == null) {
            missing.add("No minimum-dwell rule resolved for this athlete profile");
        } else if (a.getStepEnteredAt() != null) {
            int effective = baseHours + a.dwellBonusHours();
            long hoursOnStep = java.time.Duration.between(a.getStepEnteredAt(), LocalDateTime.now()).toHours();
            if (hoursOnStep < effective) {
                String detail = a.dwellBonusHours() == 0
                    ? effective + "h required"
                    : effective + "h required (" + baseHours + "h base + " + a.dwellBonusHours() + "h CISG bonus)";
                missing.add("Only " + hoursOnStep + "h on current step (" + detail + ")");
            }
        } else {
            missing.add("Step entry time missing on athlete profile");
        }

        if (!getExertionIntoleranceFlags(aid).isEmpty()) {
            missing.add("Active exertion-intolerance flag");
        }
        if (!getAlerts(aid).isEmpty()) {
            missing.add("Active emergency alert");
        }

        boolean exertionExacerbation = !s.getObjects(o -> o instanceof SymptomDuringExertionEvent
                && ((SymptomDuringExertionEvent) o).getAthleteId().equals(aid)
                && (((SymptomDuringExertionEvent) o).getDelta() > 2 || ((SymptomDuringExertionEvent) o).getDurationMinutes() > 60)).isEmpty();
        if (exertionExacerbation) {
            missing.add("Recent more-than-mild exacerbation during exertion");
        }

        if (targetStep >= 4) {
            boolean hasClearance = !s.getObjects(o -> o instanceof MedicalClearanceEvent
                    && ((MedicalClearanceEvent) o).getAthleteId().equals(aid)
                    && ((MedicalClearanceEvent) o).getClearanceForStep() >= targetStep).isEmpty();
            if (!hasClearance) {
                missing.add("Medical clearance for step " + targetStep + " required");
            }
        }

        return new ReadinessResult(ready, missing);
    }

    public java.util.Map<String, Object> estimateEarliestReturn(String aid) {
        Athlete a = knowledge.getAthlete(aid);
        if (a == null) return java.util.Map.of("error", "Athlete not found");
        KieSession s = knowledge.getSessionFor(aid);
        s.fireAllRules();
        int baseHours = 24;
        for (Object o : s.getObjects(o -> o instanceof MinStepDwellRule && ((MinStepDwellRule) o).getAthleteId().equals(aid))) {
            baseHours = ((MinStepDwellRule) o).getMinHours();
        }
        int bonus = a.dwellBonusHours();
        int minHoursPerStep = baseHours + bonus;
        int stepsRemaining = Math.max(0, 6 - a.getCurrentStep());
        int totalHours = stepsRemaining * minHoursPerStep;
        java.time.LocalDateTime earliest = java.time.LocalDateTime.now().plusHours(totalHours);
        String note;
        if (stepsRemaining == 0) {
            note = "Already at step 6 — eligible for return";
        } else if (bonus > 0) {
            note = "Optimistic estimate: " + baseHours + "h base + " + bonus + "h CISG bonus per step, no setbacks";
        } else {
            note = "Optimistic estimate assuming each step is cleared at the minimum dwell with no setbacks";
        }
        return java.util.Map.of(
                "currentStep", a.getCurrentStep(),
                "stepsRemaining", stepsRemaining,
                "minHoursPerStep", minHoursPerStep,
                "baseHoursPerStep", baseHours,
                "cisgBonusHours", bonus,
                "earliestReturn", earliest.toString(),
                "assumesNoSetbacks", true,
                "note", note
        );
    }

    public Set<String> allowedActivitiesForCurrentStep(String aid) {
        KieSession s = knowledge.getSessionFor(aid);
        s.fireAllRules();
        Set<String> out = new HashSet<>();
        QueryResults qr = s.getQueryResults("athleteAllowedActivities", aid, org.kie.api.runtime.rule.Variable.v);
        for (QueryResultsRow row : qr) {
            Object activity = row.get("activity");
            if (activity != null) out.add(activity.toString());
        }
        return out;
    }

    @SuppressWarnings("unchecked")
    private <T> List<T> queryFacts(String aid, Class<T> type, java.util.function.Predicate<T> filter) {
        KieSession s = knowledge.getSessionFor(aid);
        s.fireAllRules();
        Collection<?> facts = s.getObjects(o -> type.isInstance(o) && filter.test((T) o));
        List<T> out = new ArrayList<>();
        for (Object o : facts) out.add((T) o);
        return out;
    }

    private void ensureTimestamp(java.util.function.Supplier<Date> getter, java.util.function.Consumer<Date> setter) {
        if (getter.get() == null) setter.accept(new Date());
    }
}
