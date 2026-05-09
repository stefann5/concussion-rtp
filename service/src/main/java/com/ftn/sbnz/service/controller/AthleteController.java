package com.ftn.sbnz.service.controller;

import com.ftn.sbnz.model.domain.Athlete;
import com.ftn.sbnz.service.service.KnowledgeService;
import com.ftn.sbnz.service.service.ProtocolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/athletes")
public class AthleteController {

    private final KnowledgeService knowledge;
    private final ProtocolService protocol;

    @Autowired
    public AthleteController(KnowledgeService knowledge, ProtocolService protocol) {
        this.knowledge = knowledge;
        this.protocol = protocol;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public List<Athlete> list() {
        return knowledge.listAthletes();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN') or (hasRole('ATHLETE') and authentication.principal.athleteId == #id)")
    public ResponseEntity<Athlete> get(@PathVariable String id) {
        Athlete a = knowledge.getAthlete(id);
        return a == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(a);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public Athlete register(@RequestBody Athlete athlete) {
        if (athlete.getStepEnteredAt() == null) {
            athlete.setStepEnteredAt(LocalDateTime.now());
        }
        if (athlete.getInjuryAt() == null) {
            athlete.setInjuryAt(LocalDateTime.now());
        }
        if (athlete.getCurrentStep() == 0) {
            athlete.setCurrentStep(1);
        }
        knowledge.registerAthlete(athlete);
        return athlete;
    }

    @GetMapping("/{id}/dashboard")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN') or (hasRole('ATHLETE') and authentication.principal.athleteId == #id)")
    public Map<String, Object> dashboard(@PathVariable String id) {
        Map<String, Object> m = new java.util.LinkedHashMap<>();
        m.put("athlete", knowledge.getAthlete(id));
        m.put("recommendations", protocol.getRecommendations(id));
        m.put("alerts", protocol.getAlerts(id));
        m.put("blocks", protocol.getActivityBlocks(id));
        m.put("intoleranceFlags", protocol.getExertionIntoleranceFlags(id));
        m.put("regressTriggers", protocol.getRegressTriggers(id));
        m.put("exacerbations", protocol.getExacerbations(id));
        m.put("persisting", protocol.getPersistingSymptoms(id));
        m.put("rehabIndications", protocol.getCervicovestibularIndications(id));
        m.put("locks", protocol.getLocks(id));
        m.put("pediatricRtl", protocol.getPediatricRtl(id));
        m.put("individualizedAssessments", protocol.getIndividualizedAssessments(id));
        return m;
    }

    @GetMapping("/{id}/symptom-history")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN') or (hasRole('ATHLETE') and authentication.principal.athleteId == #id)")
    public Object symptomHistory(@PathVariable String id) {
        return protocol.getSymptomHistory(id);
    }

    @GetMapping("/{id}/estimated-return")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN') or (hasRole('ATHLETE') and authentication.principal.athleteId == #id)")
    public Map<String, Object> estimatedReturn(@PathVariable String id) {
        return protocol.estimateEarliestReturn(id);
    }

    @GetMapping("/{id}/allowed-activities")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN') or (hasRole('ATHLETE') and authentication.principal.athleteId == #id)")
    public Map<String, Object> allowedActivities(@PathVariable String id) {
        return Map.of("activities", protocol.allowedActivitiesForCurrentStep(id));
    }

    @GetMapping("/{id}/ready-to-advance")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public Object readyToAdvance(@PathVariable String id, @RequestParam int targetStep) {
        return protocol.readyToAdvance(id, targetStep);
    }
}
