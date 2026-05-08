package com.ftn.sbnz.model.facts;

import java.io.Serializable;

public class ActivityBlockedAlert implements Serializable {
    private static final long serialVersionUID = 1L;

    private String athleteId;
    private String activity;
    private int currentStep;
    private String message;

    public ActivityBlockedAlert() {}

    public ActivityBlockedAlert(String athleteId, String activity, int currentStep, String message) {
        this.athleteId = athleteId;
        this.activity = activity;
        this.currentStep = currentStep;
        this.message = message;
    }

    public String getAthleteId() { return athleteId; }
    public void setAthleteId(String athleteId) { this.athleteId = athleteId; }

    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }

    public int getCurrentStep() { return currentStep; }
    public void setCurrentStep(int currentStep) { this.currentStep = currentStep; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
