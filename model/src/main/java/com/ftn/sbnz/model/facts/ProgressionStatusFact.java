package com.ftn.sbnz.model.facts;

import com.ftn.sbnz.model.enums.ProgressionStatus;

import java.io.Serializable;

public class ProgressionStatusFact implements Serializable {
    private static final long serialVersionUID = 1L;

    private String athleteId;
    private ProgressionStatus status;
    private String explanation;

    public ProgressionStatusFact() {}

    public ProgressionStatusFact(String athleteId, ProgressionStatus status, String explanation) {
        this.athleteId = athleteId;
        this.status = status;
        this.explanation = explanation;
    }

    public String getAthleteId() { return athleteId; }
    public void setAthleteId(String athleteId) { this.athleteId = athleteId; }

    public ProgressionStatus getStatus() { return status; }
    public void setStatus(ProgressionStatus status) { this.status = status; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
