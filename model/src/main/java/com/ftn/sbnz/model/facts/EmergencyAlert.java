package com.ftn.sbnz.model.facts;

import com.ftn.sbnz.model.enums.RedFlagType;
import com.ftn.sbnz.model.enums.Severity;

import java.io.Serializable;
import java.util.Date;

public class EmergencyAlert implements Serializable {
    private static final long serialVersionUID = 1L;

    private String athleteId;
    private RedFlagType flagType;
    private Severity severity;
    private String actionType;
    private String message;
    private Date insertedAt;

    public EmergencyAlert() {}

    public EmergencyAlert(String athleteId, RedFlagType flagType, Severity severity, String actionType, String message) {
        this(athleteId, flagType, severity, actionType, message, new Date());
    }

    public EmergencyAlert(String athleteId, RedFlagType flagType, Severity severity, String actionType, String message, Date insertedAt) {
        this.athleteId = athleteId;
        this.flagType = flagType;
        this.severity = severity;
        this.actionType = actionType;
        this.message = message;
        this.insertedAt = insertedAt;
    }

    public String getAthleteId() { return athleteId; }
    public void setAthleteId(String athleteId) { this.athleteId = athleteId; }

    public RedFlagType getFlagType() { return flagType; }
    public void setFlagType(RedFlagType flagType) { this.flagType = flagType; }

    public Severity getSeverity() { return severity; }
    public void setSeverity(Severity severity) { this.severity = severity; }

    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Date getInsertedAt() { return insertedAt; }
    public void setInsertedAt(Date insertedAt) { this.insertedAt = insertedAt; }
}
