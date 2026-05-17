package com.ftn.sbnz.rules;

import com.ftn.sbnz.model.domain.Athlete;
import com.ftn.sbnz.model.enums.ActionType;
import com.ftn.sbnz.model.enums.ContactLevel;
import com.ftn.sbnz.model.enums.HistoryFlag;
import com.ftn.sbnz.model.events.ExertionAttemptEvent;
import com.ftn.sbnz.model.events.MedicalClearanceEvent;
import com.ftn.sbnz.model.events.StepAdvancementEvent;
import com.ftn.sbnz.model.events.SymptomDuringExertionEvent;
import com.ftn.sbnz.model.events.SymptomReportedEvent;
import com.ftn.sbnz.model.facts.ActivityBlockedAlert;
import com.ftn.sbnz.model.facts.EmergencyAlert;
import com.ftn.sbnz.model.facts.ExertionIntoleranceFlag;
import com.ftn.sbnz.model.facts.MinStepDwellRule;
import com.ftn.sbnz.model.facts.MoreThanMildExacerbation;
import com.ftn.sbnz.model.facts.PersistingSymptomsFlag;
import com.ftn.sbnz.model.facts.ProgressionStatusFact;
import com.ftn.sbnz.model.facts.ProtocolLockEvent;
import com.ftn.sbnz.model.facts.RegressTrigger;
import com.ftn.sbnz.model.facts.StepRecommendation;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.QueryResults;
import org.kie.api.runtime.rule.QueryResultsRow;
import org.kie.api.runtime.rule.Variable;
import org.kie.api.time.SessionPseudoClock;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

class RulesTest {

    private static RuleTestHarness harness;

    @BeforeAll
    static void buildOnce() {
        harness = new RuleTestHarness();
    }

    // ──────────────────────────────────────────────────────────────
    // CEP — single-event threshold rule
    // ──────────────────────────────────────────────────────────────

    @Test
    void moreThanMildExacerbation_fires_when_delta_exceeds_threshold() {
        KieSession s = harness.newSession();
        Athlete a = athlete(3, ContactLevel.CONTACT, HistoryFlag.NONE);
        s.insert(a);
        s.fireAllRules();

        SessionPseudoClock clock = s.getSessionClock();
        s.insert(new SymptomDuringExertionEvent(a.getId(), "HEADACHE", 3, 40, new Date(clock.getCurrentTime())));
        s.fireAllRules();

        assertThat(facts(s, MoreThanMildExacerbation.class)).hasSize(1);
        s.dispose();
    }

    // ──────────────────────────────────────────────────────────────
    // CEP — accumulate + sliding window
    // ──────────────────────────────────────────────────────────────

    @Test
    void exertionIntolerance_fires_after_two_above_threshold_events_in_48h() {
        KieSession s = harness.newSession();
        Athlete a = athlete(3, ContactLevel.CONTACT, HistoryFlag.NONE);
        s.insert(a);
        s.fireAllRules();

        SessionPseudoClock clock = s.getSessionClock();
        s.insert(new SymptomDuringExertionEvent(a.getId(), "HEADACHE", 3, 40, new Date(clock.getCurrentTime())));
        clock.advanceTime(1, TimeUnit.HOURS);
        s.insert(new SymptomDuringExertionEvent(a.getId(), "DIZZINESS", 3, 40, new Date(clock.getCurrentTime())));
        s.fireAllRules();

        assertThat(facts(s, ExertionIntoleranceFlag.class)).hasSize(1);
        s.dispose();
    }

    @Test
    void exertionIntolerance_does_NOT_fire_for_two_mild_events() {
        KieSession s = harness.newSession();
        Athlete a = athlete(3, ContactLevel.CONTACT, HistoryFlag.NONE);
        s.insert(a);
        s.fireAllRules();

        SessionPseudoClock clock = s.getSessionClock();
        s.insert(new SymptomDuringExertionEvent(a.getId(), "HEADACHE", 1, 30, new Date(clock.getCurrentTime())));
        clock.advanceTime(1, TimeUnit.HOURS);
        s.insert(new SymptomDuringExertionEvent(a.getId(), "DIZZINESS", 2, 60, new Date(clock.getCurrentTime())));
        s.fireAllRules();

        assertThat(facts(s, ExertionIntoleranceFlag.class)).isEmpty();
        s.dispose();
    }

    @Test
    void exertionIntolerance_clears_when_old_events_drop_out_of_48h_window() {
        KieSession s = harness.newSession();
        Athlete a = athlete(3, ContactLevel.CONTACT, HistoryFlag.NONE);
        s.insert(a);
        s.fireAllRules();

        SessionPseudoClock clock = s.getSessionClock();
        s.insert(new SymptomDuringExertionEvent(a.getId(), "HEADACHE", 3, 40, new Date(clock.getCurrentTime())));
        clock.advanceTime(1, TimeUnit.HOURS);
        s.insert(new SymptomDuringExertionEvent(a.getId(), "DIZZINESS", 3, 40, new Date(clock.getCurrentTime())));
        s.fireAllRules();
        assertThat(facts(s, ExertionIntoleranceFlag.class)).hasSize(1);

        clock.advanceTime(50, TimeUnit.HOURS);
        s.fireAllRules();
        assertThat(facts(s, ExertionIntoleranceFlag.class)).isEmpty();
        s.dispose();
    }

    // ──────────────────────────────────────────────────────────────
    // FC — full 3+ level chain, steps 1-3 branch (HOLD)
    // ──────────────────────────────────────────────────────────────

    @Test
    void step3_setback_produces_HOLD_recommendation_and_lock() {
        KieSession s = harness.newSession();
        Athlete a = athlete(3, ContactLevel.CONTACT, HistoryFlag.NONE);
        s.insert(a);
        s.fireAllRules();

        SessionPseudoClock clock = s.getSessionClock();
        s.insert(new SymptomDuringExertionEvent(a.getId(), "HEADACHE", 3, 40, new Date(clock.getCurrentTime())));
        clock.advanceTime(1, TimeUnit.HOURS);
        s.insert(new SymptomDuringExertionEvent(a.getId(), "DIZZINESS", 3, 40, new Date(clock.getCurrentTime())));
        s.fireAllRules();

        List<ProgressionStatusFact> statuses = facts(s, ProgressionStatusFact.class);
        assertThat(statuses).hasSize(1);
        assertThat(statuses.get(0).getStatus().name()).isEqualTo("STOP_TODAY_RETRY_TOMORROW");

        List<StepRecommendation> recs = facts(s, StepRecommendation.class);
        assertThat(recs).hasSize(1);
        assertThat(recs.get(0).getAction()).isEqualTo(ActionType.STOP_AND_RETRY);
        assertThat(recs.get(0).getCurrentStep()).isEqualTo(3);
        assertThat(recs.get(0).getRecommendedStep()).isEqualTo(3);

        assertThat(facts(s, ProtocolLockEvent.class)).hasSize(1);
        assertThat(a.getCurrentStep()).isEqualTo(3); // step NOT mutated for 1-3 setbacks
        s.dispose();
    }

    // ──────────────────────────────────────────────────────────────
    // FC — full chain, steps 4-6 branch (REGRESS, mutates athlete)
    // ──────────────────────────────────────────────────────────────

    @Test
    void step5_setback_produces_REGRESS_and_modifies_athlete_to_step3() {
        KieSession s = harness.newSession();
        Athlete a = athlete(5, ContactLevel.CONTACT, HistoryFlag.NONE);
        s.insert(a);
        s.fireAllRules();

        SessionPseudoClock clock = s.getSessionClock();
        s.insert(new SymptomDuringExertionEvent(a.getId(), "HEADACHE", 3, 40, new Date(clock.getCurrentTime())));
        clock.advanceTime(1, TimeUnit.HOURS);
        s.insert(new SymptomDuringExertionEvent(a.getId(), "DIZZINESS", 3, 40, new Date(clock.getCurrentTime())));
        s.fireAllRules();

        List<StepRecommendation> recs = facts(s, StepRecommendation.class);
        assertThat(recs).hasSize(1);
        assertThat(recs.get(0).getAction()).isEqualTo(ActionType.REGRESS);
        assertThat(recs.get(0).getRecommendedStep()).isEqualTo(3);

        assertThat(a.getCurrentStep()).isEqualTo(3);
        s.dispose();
    }

    @Test
    void single_exertion_bump_within_24h_of_step_advance_triggers_REGRESS_at_step5() {
        KieSession s = harness.newSession();
        Athlete a = athlete(5, ContactLevel.CONTACT, HistoryFlag.NONE);
        s.insert(a);
        s.fireAllRules();

        SessionPseudoClock clock = s.getSessionClock();
        s.insert(new StepAdvancementEvent(a.getId(), 4, 5, new Date(clock.getCurrentTime())));
        clock.advanceTime(3, TimeUnit.HOURS);
        s.insert(new SymptomDuringExertionEvent(a.getId(), "HEADACHE", 3, 40, new Date(clock.getCurrentTime())));
        s.fireAllRules();

        assertThat(facts(s, RegressTrigger.class)).hasSize(1);
        List<StepRecommendation> recs = facts(s, StepRecommendation.class);
        assertThat(recs).hasSize(1);
        assertThat(recs.get(0).getAction()).isEqualTo(ActionType.REGRESS);
        assertThat(a.getCurrentStep()).isEqualTo(3);
        s.dispose();
    }

    // ──────────────────────────────────────────────────────────────
    // CEP — eval-based time arithmetic
    // ──────────────────────────────────────────────────────────────

    @Test
    void persistingSymptomsFlag_fires_when_symptom_reported_more_than_4_weeks_post_injury() {
        KieSession s = harness.newSession();
        Athlete a = athlete(2, ContactLevel.NONCONTACT, HistoryFlag.NONE);
        a.setInjuryAt(LocalDateTime.now().minusDays(29));
        s.insert(a);
        s.fireAllRules();

        s.insert(new SymptomReportedEvent(a.getId(), "HEADACHE", 2, new Date()));
        s.fireAllRules();

        assertThat(facts(s, PersistingSymptomsFlag.class)).hasSize(1);
        s.dispose();
    }

    // ──────────────────────────────────────────────────────────────
    // Templates — RedFlagSeverity table generates per-flag rules
    // ──────────────────────────────────────────────────────────────

    @Test
    void redFlagSeverity_template_fires_emergencyAlert_for_LOSS_OF_CONSCIOUSNESS() {
        KieSession s = harness.newSession();
        Athlete a = athlete(1, ContactLevel.CONTACT, HistoryFlag.NONE);
        s.insert(a);
        s.fireAllRules();

        s.insert(new SymptomReportedEvent(a.getId(), "LOSS_OF_CONSCIOUSNESS", 1, new Date()));
        s.fireAllRules();

        List<EmergencyAlert> alerts = facts(s, EmergencyAlert.class);
        assertThat(alerts).hasSize(1);
        assertThat(alerts.get(0).getActionType()).isEqualTo("IMMEDIATE_TRANSPORT");
        s.dispose();
    }

    @Test
    void medicalClearance_retracts_pre_clearance_emergencyAlert() {
        KieSession s = harness.newSession();
        Athlete a = athlete(1, ContactLevel.CONTACT, HistoryFlag.NONE);
        s.insert(a);
        s.fireAllRules();

        s.insert(new SymptomReportedEvent(a.getId(), "LOSS_OF_CONSCIOUSNESS", 1, new Date()));
        s.fireAllRules();
        assertThat(facts(s, EmergencyAlert.class)).hasSize(1);

        Date clearedAt = new Date(System.currentTimeMillis() + 10_000);
        s.insert(new MedicalClearanceEvent(a.getId(), 2, "doc_42", "Cleared after evaluation", clearedAt));
        s.fireAllRules();
        assertThat(facts(s, EmergencyAlert.class)).isEmpty();
        s.dispose();
    }

    @Test
    void medicalClearance_does_NOT_retract_post_clearance_emergencyAlert() {
        KieSession s = harness.newSession();
        Athlete a = athlete(1, ContactLevel.CONTACT, HistoryFlag.NONE);
        s.insert(a);
        s.fireAllRules();

        // Clearance recorded first, at T0.
        Date clearedAt = new Date(System.currentTimeMillis() - 60_000);
        s.insert(new MedicalClearanceEvent(a.getId(), 2, "doc_42", "Cleared after evaluation", clearedAt));
        s.fireAllRules();

        // New red flag arrives AFTER clearance — should survive.
        s.insert(new SymptomReportedEvent(a.getId(), "LOSS_OF_CONSCIOUSNESS", 1, new Date()));
        s.fireAllRules();
        assertThat(facts(s, EmergencyAlert.class)).hasSize(1);
        s.dispose();
    }

    // ──────────────────────────────────────────────────────────────
    // Templates — MinStepDwell seeds a per-athlete fact
    // ──────────────────────────────────────────────────────────────

    @Test
    void minStepDwellRule_inserted_per_athlete_by_template() {
        KieSession s = harness.newSession();
        Athlete a = athlete(2, ContactLevel.CONTACT, HistoryFlag.MULTIPLE);
        s.insert(a);
        s.fireAllRules();

        List<MinStepDwellRule> rules = facts(s, MinStepDwellRule.class);
        assertThat(rules).hasSize(1);
        assertThat(rules.get(0).getMinHours()).isEqualTo(48); // CSV row CONTACT,MULTIPLE,48
        s.dispose();
    }

    // ──────────────────────────────────────────────────────────────
    // BC — plain conjunction query, both branches
    // ──────────────────────────────────────────────────────────────

    @Test
    void readyToAdvance_returns_row_when_all_conditions_met() {
        KieSession s = harness.newSession();
        Athlete a = athlete(2, ContactLevel.CONTACT, HistoryFlag.NONE);
        a.setStepEnteredAt(LocalDateTime.now().minusHours(48));
        s.insert(a);
        s.fireAllRules();

        QueryResults qr = s.getQueryResults("readyToAdvance", a.getId(), 3);
        assertThat(qr.size()).isEqualTo(1);
        s.dispose();
    }

    @Test
    void readyToAdvance_returns_no_rows_when_intolerance_flag_present() {
        KieSession s = harness.newSession();
        Athlete a = athlete(2, ContactLevel.CONTACT, HistoryFlag.NONE);
        a.setStepEnteredAt(LocalDateTime.now().minusHours(48));
        s.insert(a);
        s.fireAllRules();

        // Trigger the flag organically — manual insert would be retracted by the
        // "clear when 48h window no longer holds the pattern" rule.
        SessionPseudoClock clock = s.getSessionClock();
        s.insert(new SymptomDuringExertionEvent(a.getId(), "HEADACHE", 3, 40, new Date(clock.getCurrentTime())));
        clock.advanceTime(1, TimeUnit.HOURS);
        s.insert(new SymptomDuringExertionEvent(a.getId(), "DIZZINESS", 3, 40, new Date(clock.getCurrentTime())));
        s.fireAllRules();
        assertThat(facts(s, ExertionIntoleranceFlag.class)).hasSize(1);

        QueryResults qr = s.getQueryResults("readyToAdvance", a.getId(), 3);
        assertThat(qr.size()).isEqualTo(0);
        s.dispose();
    }

    // ──────────────────────────────────────────────────────────────
    // BC — recursive query with unbound parameter (enumeration)
    // ──────────────────────────────────────────────────────────────

    @Test
    void isInCategory_recursive_BC_enumerates_drills_under_sport_specific_no_contact() {
        KieSession s = harness.newSession();

        QueryResults qr = s.getQueryResults("isInCategory", Variable.v, "SPORT_SPECIFIC_NO_CONTACT");
        Set<String> matches = new HashSet<>();
        for (QueryResultsRow row : qr) matches.add(row.get("activity").toString());

        assertThat(matches)
                .as("enumerated activities under SPORT_SPECIFIC_NO_CONTACT")
                .contains("LINEAR_RUNNING", "CHANGE_OF_DIRECTION",
                          "INDIVIDUAL_PASSING_DRILL", "INDIVIDUAL_SHOOTING_DRILL",
                          "RUNNING_DRILLS", "BALL_DRILLS");
        s.dispose();
    }

    // ──────────────────────────────────────────────────────────────
    // BC used inside an FC rule's LHS — activity validation
    // ──────────────────────────────────────────────────────────────

    @Test
    void activity_outside_allowed_top_category_for_current_step_is_blocked() {
        KieSession s = harness.newSession();
        Athlete a = athlete(2, ContactLevel.CONTACT, HistoryFlag.NONE);
        s.insert(a);
        s.fireAllRules();

        // Step 2 allows LIGHT_AEROBIC; FULL_CONTACT_TACKLE is under CONTACT — should be blocked.
        s.insert(new ExertionAttemptEvent(a.getId(), "FULL_CONTACT_TACKLE", new Date()));
        s.fireAllRules();

        List<ActivityBlockedAlert> blocks = facts(s, ActivityBlockedAlert.class);
        assertThat(blocks).hasSize(1);
        assertThat(blocks.get(0).getActivity()).isEqualTo("FULL_CONTACT_TACKLE");
        s.dispose();
    }

    // ──────────────────────────────────────────────────────────────
    // helpers
    // ──────────────────────────────────────────────────────────────

    private static Athlete athlete(int step, ContactLevel contact, HistoryFlag history) {
        Athlete a = new Athlete();
        a.setId("ath_" + UUID.randomUUID().toString().substring(0, 8));
        a.setName("Test Athlete");
        a.setSport("rugby");
        a.setContactLevel(contact);
        a.setHistoryFlag(history);
        a.setCurrentStep(step);
        a.setStepEnteredAt(LocalDateTime.now());
        a.setInjuryAt(LocalDateTime.now().minusDays(1));
        return a;
    }

    @SuppressWarnings("unchecked")
    private static <T> List<T> facts(KieSession s, Class<T> type) {
        return s.getObjects(o -> type.isInstance(o)).stream()
                .map(o -> (T) o)
                .collect(Collectors.toList());
    }
}
