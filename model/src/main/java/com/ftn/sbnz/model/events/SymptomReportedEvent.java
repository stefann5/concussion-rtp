package com.ftn.sbnz.model.events;

import org.kie.api.definition.type.Expires;
import org.kie.api.definition.type.Role;
import org.kie.api.definition.type.Timestamp;

import java.io.Serializable;
import java.util.Date;

@Role(Role.Type.EVENT)
@Timestamp("timestamp")
@Expires("60d")
public class SymptomReportedEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    private String athleteId;
    private String symptom;
    private int level;
    private Date timestamp;

    public SymptomReportedEvent() {}

    public SymptomReportedEvent(String athleteId, String symptom, int level, Date timestamp) {
        this.athleteId = athleteId;
        this.symptom = symptom;
        this.level = level;
        this.timestamp = timestamp;
    }

    public String getAthleteId() { return athleteId; }
    public void setAthleteId(String athleteId) { this.athleteId = athleteId; }

    public String getSymptom() { return symptom; }
    public void setSymptom(String symptom) { this.symptom = symptom; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}
