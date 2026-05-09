package com.ftn.sbnz.model.facts;

import java.io.Serializable;

public class PediatricRtlPending implements Serializable {
    private static final long serialVersionUID = 1L;
    private String athleteId;
    private String message;

    public PediatricRtlPending() {}
    public PediatricRtlPending(String athleteId, String message) {
        this.athleteId = athleteId;
        this.message = message;
    }
    public String getAthleteId() { return athleteId; }
    public void setAthleteId(String athleteId) { this.athleteId = athleteId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
