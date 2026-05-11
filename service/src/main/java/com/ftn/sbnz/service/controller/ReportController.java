package com.ftn.sbnz.service.controller;

import com.ftn.sbnz.model.domain.Athlete;
import com.ftn.sbnz.model.events.SymptomReportedEvent;
import com.ftn.sbnz.service.service.KnowledgeService;
import com.ftn.sbnz.service.service.ProtocolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
public class ReportController {

    private final KnowledgeService knowledge;
    private final ProtocolService protocol;

    @Autowired
    public ReportController(KnowledgeService knowledge, ProtocolService protocol) {
        this.knowledge = knowledge;
        this.protocol = protocol;
    }

    @GetMapping("/athletes-by-step")
    public Map<Integer, Long> byStep() {
        return knowledge.listAthletes().stream()
                .collect(Collectors.groupingBy(Athlete::getCurrentStep, Collectors.counting()));
    }

    @GetMapping("/by-sport")
    public Map<String, Long> bySport() {
        return knowledge.listAthletes().stream()
                .collect(Collectors.groupingBy(a -> a.getSport() == null ? "—" : a.getSport(), Collectors.counting()));
    }

    @GetMapping("/avg-recovery-days")
    public Map<String, Object> avgRecoveryDays() {
        var rows = knowledge.listAthletes().stream()
                .flatMap(a -> a.getPreviousConcussions().stream())
                .mapToInt(p -> p.getRecoveryDays())
                .toArray();
        if (rows.length == 0) {
            return Map.of("count", 0, "avgDays", 0.0, "note", "No prior concussion records to average");
        }
        double avg = java.util.Arrays.stream(rows).average().orElse(0);
        return Map.of("count", rows.length, "avgDays", avg);
    }

    @GetMapping("/risk-summary")
    public List<Map<String, Object>> riskSummary() {
        return knowledge.listAthletes().stream().map(a -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", a.getId());
            m.put("name", a.getName());
            m.put("sport", a.getSport());
            m.put("currentStep", a.getCurrentStep());
            m.put("alerts", protocol.getAlerts(a.getId()).size());
            m.put("intolerance", protocol.getExertionIntoleranceFlags(a.getId()).size());
            m.put("persisting", protocol.getPersistingSymptoms(a.getId()).size());
            m.put("rehab", protocol.getCervicovestibularIndications(a.getId()).size());
            m.put("individualized", protocol.getIndividualizedAssessments(a.getId()).size());
            return m;
        }).sorted((a, b) -> a.get("name").toString().compareTo(b.get("name").toString()))
          .collect(Collectors.toList());
    }

    @GetMapping("/adherence/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN') or (hasRole('ATHLETE') and authentication.principal.athleteId == #id)")
    public Map<String, Object> adherence(@PathVariable String id) {
        Athlete a = knowledge.getAthlete(id);
        if (a == null || a.getInjuryAt() == null) {
            return Map.of("error", "Athlete not found or injury date missing");
        }
        long daysSinceInjury = Math.max(1, Duration.between(a.getInjuryAt(), LocalDateTime.now()).toDays() + 1);
        List<SymptomReportedEvent> history = protocol.getSymptomHistory(id);
        long uniqueReportDays = history.stream()
                .map(ev -> ev.getTimestamp().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate())
                .distinct()
                .count();
        double pct = (double) uniqueReportDays / daysSinceInjury * 100.0;
        return Map.of(
                "daysSinceInjury", daysSinceInjury,
                "daysWithReport", uniqueReportDays,
                "adherencePct", Math.round(pct * 10) / 10.0
        );
    }
}
