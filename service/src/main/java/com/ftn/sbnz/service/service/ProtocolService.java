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
import com.ftn.sbnz.model.facts.StepRecommendation;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.QueryResults;
import org.kie.api.runtime.rule.QueryResultsRow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProtocolService {

    private final KnowledgeService knowledge;

    @Autowired
    public ProtocolService(KnowledgeService knowledge) {
        this.knowledge = knowledge;
    }

    public int reportSymptom(SymptomReportedEvent ev) {
        ensureTimestamp(ev::getTimestamp, ev::setTimestamp);
        KieSession s = knowledge.getSessionFor(ev.getAthleteId());
        s.insert(ev);
        return s.fireAllRules();
    }

    public int reportExertionAttempt(ExertionAttemptEvent ev) {
        ensureTimestamp(ev::getTimestamp, ev::setTimestamp);
        KieSession s = knowledge.getSessionFor(ev.getAthleteId());
        s.insert(ev);
        return s.fireAllRules();
    }

    public int reportSymptomDuringExertion(SymptomDuringExertionEvent ev) {
        ensureTimestamp(ev::getTimestamp, ev::setTimestamp);
        KieSession s = knowledge.getSessionFor(ev.getAthleteId());
        s.insert(ev);
        return s.fireAllRules();
    }

    public int recordStepAdvancement(StepAdvancementEvent ev) {
        ensureTimestamp(ev::getTimestamp, ev::setTimestamp);
        Athlete a = knowledge.getAthlete(ev.getAthleteId());
        if (a != null) {
            a.setCurrentStep(ev.getToStep());
            a.setStepEnteredAt(LocalDateTime.now());
        }
        KieSession s = knowledge.getSessionFor(ev.getAthleteId());
        for (Object o : new ArrayList<>(s.getObjects(o -> o instanceof Athlete && ((Athlete) o).getId().equals(ev.getAthleteId())))) {
            s.delete(s.getFactHandle(o));
        }
        s.insert(a);
        s.insert(ev);
        return s.fireAllRules();
    }

    public int recordMedicalClearance(MedicalClearanceEvent ev) {
        ensureTimestamp(ev::getTimestamp, ev::setTimestamp);
        KieSession s = knowledge.getSessionFor(ev.getAthleteId());
        s.insert(ev);
        return s.fireAllRules();
    }

    public int recordObjectiveTest(ObjectiveTestEvent ev) {
        ensureTimestamp(ev::getTimestamp, ev::setTimestamp);
        KieSession s = knowledge.getSessionFor(ev.getAthleteId());
        s.insert(ev);
        return s.fireAllRules();
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
        if (a.getCurrentStep() != targetStep - 1) {
            missing.add("Current step (" + a.getCurrentStep() + ") is not target - 1");
        }
        if (!getExertionIntoleranceFlags(aid).isEmpty()) {
            missing.add("Active ExertionIntoleranceFlag");
        }
        if (!getAlerts(aid).isEmpty()) {
            missing.add("Active EmergencyAlert");
        }
        if (targetStep >= 4) {
            QueryResults clr = s.getQueryResults("readyToAdvance", aid, targetStep);
            boolean hasClearance = clr.iterator().hasNext();
            if (!hasClearance && !ready) {
                missing.add("Medical clearance for step " + targetStep + " required");
            }
        }
        return new ReadinessResult(ready, missing);
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
