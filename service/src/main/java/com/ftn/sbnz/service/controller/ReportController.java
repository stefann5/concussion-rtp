package com.ftn.sbnz.service.controller;

import com.ftn.sbnz.model.domain.Athlete;
import com.ftn.sbnz.service.service.KnowledgeService;
import com.ftn.sbnz.service.service.ProtocolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
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

    @GetMapping("/risk-summary")
    public List<Map<String, Object>> riskSummary() {
        return knowledge.listAthletes().stream().map(a -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", a.getId());
            m.put("name", a.getName());
            m.put("currentStep", a.getCurrentStep());
            m.put("alerts", protocol.getAlerts(a.getId()).size());
            m.put("intolerance", protocol.getExertionIntoleranceFlags(a.getId()).size());
            m.put("persisting", protocol.getPersistingSymptoms(a.getId()).size());
            m.put("rehab", protocol.getCervicovestibularIndications(a.getId()).size());
            return m;
        }).collect(Collectors.toList());
    }
}
