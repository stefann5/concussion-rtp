package com.ftn.sbnz.service.admin;

import com.ftn.sbnz.service.service.KnowledgeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/templates")
@PreAuthorize("hasRole('ADMIN')")
public class TemplateController {

    private final KnowledgeService knowledge;

    public TemplateController(KnowledgeService knowledge) {
        this.knowledge = knowledge;
    }

    @GetMapping
    public List<String> list() {
        return List.of("MinStepDwell", "RedFlagSeverity", "AllowedActivity");
    }

    @GetMapping("/{name}")
    public ResponseEntity<?> get(@PathVariable String name) {
        String csv = knowledge.getTemplateCsv(name);
        if (csv == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Map.of("name", name, "csv", csv));
    }

    @PutMapping("/{name}")
    public ResponseEntity<?> put(@PathVariable String name, @RequestBody Map<String, String> body) {
        String csv = body.get("csv");
        if (csv == null) return ResponseEntity.badRequest().body(Map.of("error", "csv required"));
        try {
            knowledge.updateTemplateCsv(name, csv);
            return ResponseEntity.ok(Map.of("ok", true, "rebuiltAt", java.time.LocalDateTime.now().toString()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
