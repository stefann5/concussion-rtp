package com.ftn.sbnz.model.events;

import org.kie.api.definition.type.Expires;
import org.kie.api.definition.type.Role;
import org.kie.api.definition.type.Timestamp;

import java.io.Serializable;
import java.util.Date;

@Role(Role.Type.EVENT)
@Timestamp("timestamp")
@Expires("60d")
public class StepAdvancementEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    private String athleteId;
    private int fromStep;
    private int toStep;
    private Date timestamp;

    public StepAdvancementEvent() {}

    public StepAdvancementEvent(String athleteId, int fromStep, int toStep, Date timestamp) {
        this.athleteId = athleteId;
        this.fromStep = fromStep;
        this.toStep = toStep;
        this.timestamp = timestamp;
    }

    public String getAthleteId() { return athleteId; }
    public void setAthleteId(String athleteId) { this.athleteId = athleteId; }

    public int getFromStep() { return fromStep; }
    public void setFromStep(int fromStep) { this.fromStep = fromStep; }

    public int getToStep() { return toStep; }
    public void setToStep(int toStep) { this.toStep = toStep; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}
