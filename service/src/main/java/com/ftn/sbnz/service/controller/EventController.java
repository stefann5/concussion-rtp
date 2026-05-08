package com.ftn.sbnz.service.controller;

import com.ftn.sbnz.model.events.ExertionAttemptEvent;
import com.ftn.sbnz.model.events.MedicalClearanceEvent;
import com.ftn.sbnz.model.events.ObjectiveTestEvent;
import com.ftn.sbnz.model.events.StepAdvancementEvent;
import com.ftn.sbnz.model.events.SymptomDuringExertionEvent;
import com.ftn.sbnz.model.events.SymptomReportedEvent;
import com.ftn.sbnz.service.service.ProtocolService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Map<String, Object> symptom(@RequestBody SymptomReportedEvent ev) {
        int fired = protocol.reportSymptom(ev);
        return Map.of("rulesFired", fired);
    }

    @PostMapping("/exertion-attempt")
    public Map<String, Object> exertionAttempt(@RequestBody ExertionAttemptEvent ev) {
        int fired = protocol.reportExertionAttempt(ev);
        return Map.of("rulesFired", fired);
    }

    @PostMapping("/symptom-during-exertion")
    public Map<String, Object> symptomDuringExertion(@RequestBody SymptomDuringExertionEvent ev) {
        int fired = protocol.reportSymptomDuringExertion(ev);
        return Map.of("rulesFired", fired);
    }

    @PostMapping("/step-advancement")
    public Map<String, Object> stepAdvancement(@RequestBody StepAdvancementEvent ev) {
        int fired = protocol.recordStepAdvancement(ev);
        return Map.of("rulesFired", fired);
    }

    @PostMapping("/medical-clearance")
    public Map<String, Object> medicalClearance(@RequestBody MedicalClearanceEvent ev) {
        int fired = protocol.recordMedicalClearance(ev);
        return Map.of("rulesFired", fired);
    }

    @PostMapping("/objective-test")
    public Map<String, Object> objectiveTest(@RequestBody ObjectiveTestEvent ev) {
        int fired = protocol.recordObjectiveTest(ev);
        return Map.of("rulesFired", fired);
    }
}
