package com.ftn.sbnz.service.controller;

import com.ftn.sbnz.model.events.ExertionAttemptEvent;
import com.ftn.sbnz.model.events.MedicalClearanceEvent;
import com.ftn.sbnz.model.events.ObjectiveTestEvent;
import com.ftn.sbnz.model.events.StepAdvancementEvent;
import com.ftn.sbnz.model.events.SymptomDuringExertionEvent;
import com.ftn.sbnz.model.events.SymptomReportedEvent;
import com.ftn.sbnz.service.service.ProtocolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final ProtocolService protocol;

    @Autowired
    public EventController(ProtocolService protocol) {
        this.protocol = protocol;
    }

    @PostMapping("/symptom")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN') or (hasRole('ATHLETE') and authentication.principal.athleteId == #ev.athleteId)")
    public Map<String, Object> symptom(@RequestBody SymptomReportedEvent ev) {
        int fired = protocol.reportSymptom(ev);
        return Map.of("rulesFired", fired);
    }

    @PostMapping("/daily-check")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN') or (hasRole('ATHLETE') and authentication.principal.athleteId == #req.athleteId)")
    public Map<String, Object> dailyCheck(@RequestBody DailyCheckRequest req) {
        int submitted = 0;
        int fired = 0;
        if (req.getLevels() != null) {
            for (Map.Entry<String, Integer> e : req.getLevels().entrySet()) {
                int level = e.getValue() == null ? 0 : e.getValue();
                if (level <= 0) continue;
                fired += protocol.reportSymptom(new SymptomReportedEvent(req.getAthleteId(), e.getKey(), level, null));
                submitted++;
            }
        }
        return Map.of("submitted", submitted, "rulesFired", fired);
    }

    @PostMapping("/exertion-attempt")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN') or (hasRole('ATHLETE') and authentication.principal.athleteId == #ev.athleteId)")
    public Map<String, Object> exertionAttempt(@RequestBody ExertionAttemptEvent ev) {
        int fired = protocol.reportExertionAttempt(ev);
        return Map.of("rulesFired", fired);
    }

    @PostMapping("/symptom-during-exertion")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN') or (hasRole('ATHLETE') and authentication.principal.athleteId == #ev.athleteId)")
    public Map<String, Object> symptomDuringExertion(@RequestBody SymptomDuringExertionEvent ev) {
        int fired = protocol.reportSymptomDuringExertion(ev);
        return Map.of("rulesFired", fired);
    }

    @PostMapping("/exertion-with-symptoms")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN') or (hasRole('ATHLETE') and authentication.principal.athleteId == #req.exertion.athleteId)")
    public Map<String, Object> exertionWithSymptoms(@RequestBody ExertionWithSymptomsRequest req) {
        int fired = protocol.reportExertionAttempt(req.getExertion());
        int symptomCount = 0;
        if (req.getSymptoms() != null) {
            for (SymptomDuringExertionEvent ev : req.getSymptoms()) {
                if (ev.getAthleteId() == null) ev.setAthleteId(req.getExertion().getAthleteId());
                fired += protocol.reportSymptomDuringExertion(ev);
                symptomCount++;
            }
        }
        return Map.of("symptomCount", symptomCount, "rulesFired", fired);
    }

    @PostMapping("/step-advancement")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public Map<String, Object> stepAdvancement(@RequestBody StepAdvancementEvent ev) {
        int fired = protocol.recordStepAdvancement(ev);
        return Map.of("rulesFired", fired);
    }

    @PostMapping("/medical-clearance")
    @PreAuthorize("hasRole('DOCTOR')")
    public Map<String, Object> medicalClearance(@RequestBody MedicalClearanceEvent ev) {
        int fired = protocol.recordMedicalClearance(ev);
        return Map.of("rulesFired", fired);
    }

    @PostMapping("/objective-test")
    @PreAuthorize("hasRole('DOCTOR')")
    public Map<String, Object> objectiveTest(@RequestBody ObjectiveTestEvent ev) {
        int fired = protocol.recordObjectiveTest(ev);
        return Map.of("rulesFired", fired);
    }
}
