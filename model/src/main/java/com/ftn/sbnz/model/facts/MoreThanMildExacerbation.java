package com.ftn.sbnz.model.facts;

import java.io.Serializable;

public class MoreThanMildExacerbation implements Serializable {
    private static final long serialVersionUID = 1L;

    private String athleteId;
    private String symptom;
    private int delta;
    private int durationMinutes;

    public MoreThanMildExacerbation() {}

    public MoreThanMildExacerbation(String athleteId, String symptom, int delta, int durationMinutes) {
        this.athleteId = athleteId;
        this.symptom = symptom;
        this.delta = delta;
        this.durationMinutes = durationMinutes;
    }

    public String getAthleteId() { return athleteId; }
    public void setAthleteId(String athleteId) { this.athleteId = athleteId; }

    public String getSymptom() { return symptom; }
    public void setSymptom(String symptom) { this.symptom = symptom; }

    public int getDelta() { return delta; }
    public void setDelta(int delta) { this.delta = delta; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
}
