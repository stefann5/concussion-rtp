package com.ftn.sbnz.model.events;

import org.kie.api.definition.type.Expires;
import org.kie.api.definition.type.Role;
import org.kie.api.definition.type.Timestamp;

import java.io.Serializable;
import java.util.Date;

@Role(Role.Type.EVENT)
@Timestamp("timestamp")
@Expires("30d")
public class SymptomDuringExertionEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    private String athleteId;
    private String symptom;
    private int delta;
    private int durationMinutes;
    private Date timestamp;

    public SymptomDuringExertionEvent() {}

    public SymptomDuringExertionEvent(String athleteId, String symptom, int delta, int durationMinutes, Date timestamp) {
        this.athleteId = athleteId;
        this.symptom = symptom;
        this.delta = delta;
        this.durationMinutes = durationMinutes;
        this.timestamp = timestamp;
    }

    public String getAthleteId() { return athleteId; }
    public void setAthleteId(String athleteId) { this.athleteId = athleteId; }

    public String getSymptom() { return symptom; }
    public void setSymptom(String symptom) { this.symptom = symptom; }

    public int getDelta() { return delta; }
    public void setDelta(int delta) { this.delta = delta; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}
