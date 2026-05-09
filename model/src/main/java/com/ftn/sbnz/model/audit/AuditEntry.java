package com.ftn.sbnz.model.audit;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public class AuditEntry implements Serializable {
    private static final long serialVersionUID = 1L;

    private Date timestamp;
    private String athleteId;
    private String trigger;
    private String actor;
    private List<String> rulesFired;
    private List<String> factsInserted;

    public AuditEntry() {}

    public AuditEntry(Date timestamp, String athleteId, String trigger, String actor,
                      List<String> rulesFired, List<String> factsInserted) {
        this.timestamp = timestamp;
        this.athleteId = athleteId;
        this.trigger = trigger;
        this.actor = actor;
        this.rulesFired = rulesFired;
        this.factsInserted = factsInserted;
    }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
    public String getAthleteId() { return athleteId; }
    public void setAthleteId(String athleteId) { this.athleteId = athleteId; }
    public String getTrigger() { return trigger; }
    public void setTrigger(String trigger) { this.trigger = trigger; }
    public String getActor() { return actor; }
    public void setActor(String actor) { this.actor = actor; }
    public List<String> getRulesFired() { return rulesFired; }
    public void setRulesFired(List<String> rulesFired) { this.rulesFired = rulesFired; }
    public List<String> getFactsInserted() { return factsInserted; }
    public void setFactsInserted(List<String> factsInserted) { this.factsInserted = factsInserted; }
}
