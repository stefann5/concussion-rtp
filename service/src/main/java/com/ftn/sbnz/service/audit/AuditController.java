package com.ftn.sbnz.service.audit;

import com.ftn.sbnz.model.audit.AuditEntry;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditController {

    private final AuditService audit;

    public AuditController(AuditService audit) {
        this.audit = audit;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public List<AuditEntry> all() {
        return audit.all();
    }

    @GetMapping("/{athleteId}")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN') or (hasRole('ATHLETE') and authentication.principal.athleteId == #athleteId)")
    public List<AuditEntry> forAthlete(@PathVariable String athleteId) {
        return audit.entriesFor(athleteId);
    }
}
