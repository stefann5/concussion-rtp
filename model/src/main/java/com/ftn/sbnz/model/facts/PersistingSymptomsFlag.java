package com.ftn.sbnz.model.facts;

import java.io.Serializable;

public class PersistingSymptomsFlag implements Serializable {
    private static final long serialVersionUID = 1L;

    private String athleteId;
    private String reason;

    public PersistingSymptomsFlag() {}

    public PersistingSymptomsFlag(String athleteId, String reason) {
        this.athleteId = athleteId;
        this.reason = reason;
    }

    public String getAthleteId() { return athleteId; }
    public void setAthleteId(String athleteId) { this.athleteId = athleteId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
