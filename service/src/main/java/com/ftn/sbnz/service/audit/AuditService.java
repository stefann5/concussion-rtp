package com.ftn.sbnz.service.audit;

import com.ftn.sbnz.model.audit.AuditEntry;
import org.kie.api.event.rule.AfterMatchFiredEvent;
import org.kie.api.event.rule.DefaultAgendaEventListener;
import org.kie.api.event.rule.DefaultRuleRuntimeEventListener;
import org.kie.api.event.rule.ObjectInsertedEvent;
import org.kie.api.runtime.KieSession;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuditService {

    private final Map<String, List<AuditEntry>> log = new ConcurrentHashMap<>();
    private final Map<String, Recorder> recorders = new ConcurrentHashMap<>();

    public Recorder attach(String athleteId, KieSession session) {
        Recorder rec = recorders.computeIfAbsent(athleteId, id -> {
            Recorder r = new Recorder();
            session.addEventListener(new DefaultAgendaEventListener() {
                @Override
                public void afterMatchFired(AfterMatchFiredEvent ev) {
                    r.rules.add(ev.getMatch().getRule().getName());
                }
            });
            session.addEventListener(new DefaultRuleRuntimeEventListener() {
                @Override
                public void objectInserted(ObjectInsertedEvent ev) {
                    Object o = ev.getObject();
                    r.facts.add(o.getClass().getSimpleName());
                }
            });
            return r;
        });
        rec.reset();
        return rec;
    }

    public void record(String athleteId, String trigger, String actor, Recorder rec) {
        AuditEntry entry = new AuditEntry(new Date(), athleteId, trigger, actor,
                new ArrayList<>(rec.rules), new ArrayList<>(rec.facts));
        log.computeIfAbsent(athleteId, k -> Collections.synchronizedList(new ArrayList<>())).add(entry);
        rec.reset();
    }

    public List<AuditEntry> entriesFor(String athleteId) {
        return log.getOrDefault(athleteId, List.of());
    }

    public List<AuditEntry> all() {
        List<AuditEntry> out = new ArrayList<>();
        log.values().forEach(out::addAll);
        out.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
        return out;
    }

    public static class Recorder {
        public final List<String> rules = Collections.synchronizedList(new ArrayList<>());
        public final List<String> facts = Collections.synchronizedList(new ArrayList<>());
        public void reset() { rules.clear(); facts.clear(); }
    }
}
