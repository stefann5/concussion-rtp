package com.ftn.sbnz.model.events;

import org.kie.api.definition.type.Expires;
import org.kie.api.definition.type.Role;
import org.kie.api.definition.type.Timestamp;

import java.io.Serializable;
import java.util.Date;

@Role(Role.Type.EVENT)
@Timestamp("timestamp")
@Expires("30d")
public class ExertionAttemptEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    private String athleteId;
    private String activity;
    private Date timestamp;

    public ExertionAttemptEvent() {}

    public ExertionAttemptEvent(String athleteId, String activity, Date timestamp) {
        this.athleteId = athleteId;
        this.activity = activity;
        this.timestamp = timestamp;
    }

    public String getAthleteId() { return athleteId; }
    public void setAthleteId(String athleteId) { this.athleteId = athleteId; }

    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}
