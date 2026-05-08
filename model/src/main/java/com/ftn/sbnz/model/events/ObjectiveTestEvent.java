package com.ftn.sbnz.model.events;

import org.kie.api.definition.type.Expires;
import org.kie.api.definition.type.Role;
import org.kie.api.definition.type.Timestamp;

import java.io.Serializable;
import java.util.Date;

@Role(Role.Type.EVENT)
@Timestamp("timestamp")
@Expires("365d")
public class ObjectiveTestEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    private String athleteId;
    private String testType;
    private double value;
    private Date timestamp;

    public ObjectiveTestEvent() {}

    public ObjectiveTestEvent(String athleteId, String testType, double value, Date timestamp) {
        this.athleteId = athleteId;
        this.testType = testType;
        this.value = value;
        this.timestamp = timestamp;
    }

    public String getAthleteId() { return athleteId; }
    public void setAthleteId(String athleteId) { this.athleteId = athleteId; }

    public String getTestType() { return testType; }
    public void setTestType(String testType) { this.testType = testType; }

    public double getValue() { return value; }
    public void setValue(double value) { this.value = value; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}
