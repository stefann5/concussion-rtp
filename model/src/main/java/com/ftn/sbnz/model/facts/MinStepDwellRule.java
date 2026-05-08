package com.ftn.sbnz.model.facts;

import java.io.Serializable;

public class MinStepDwellRule implements Serializable {
    private static final long serialVersionUID = 1L;

    private String athleteId;
    private int minHours;

    public MinStepDwellRule() {}

    public MinStepDwellRule(String athleteId, int minHours) {
        this.athleteId = athleteId;
        this.minHours = minHours;
    }

    public String getAthleteId() { return athleteId; }
    public void setAthleteId(String athleteId) { this.athleteId = athleteId; }

    public int getMinHours() { return minHours; }
    public void setMinHours(int minHours) { this.minHours = minHours; }
}
