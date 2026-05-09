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
        return Map.of(
                "athlete", knowledge.getAthlete(id),
                "recommendations", protocol.getRecommendations(id),
                "alerts", protocol.getAlerts(id),
                "blocks", protocol.getActivityBlocks(id),
                "intoleranceFlags", protocol.getExertionIntoleranceFlags(id),
                "regressTriggers", protocol.getRegressTriggers(id),
                "exacerbations", protocol.getExacerbations(id),
                "persisting", protocol.getPersistingSymptoms(id),
                "rehabIndications", protocol.getCervicovestibularIndications(id),
                "locks", protocol.getLocks(id)
        );
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
