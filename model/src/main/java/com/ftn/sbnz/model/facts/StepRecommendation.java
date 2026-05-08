package com.ftn.sbnz.model.facts;

import com.ftn.sbnz.model.enums.ActionType;

import java.io.Serializable;

public class StepRecommendation implements Serializable {
    private static final long serialVersionUID = 1L;

    private String athleteId;
    private ActionType action;
    private int currentStep;
    private int recommendedStep;
    private int retryAfterHours;
    private String explanation;

    public StepRecommendation() {}

    public StepRecommendation(String athleteId, ActionType action, int currentStep, int recommendedStep, int retryAfterHours, String explanation) {
        this.athleteId = athleteId;
        this.action = action;
        this.currentStep = currentStep;
        this.recommendedStep = recommendedStep;
        this.retryAfterHours = retryAfterHours;
        this.explanation = explanation;
    }

    public String getAthleteId() { return athleteId; }
    public void setAthleteId(String athleteId) { this.athleteId = athleteId; }

    public ActionType getAction() { return action; }
    public void setAction(ActionType action) { this.action = action; }

    public int getCurrentStep() { return currentStep; }
    public void setCurrentStep(int currentStep) { this.currentStep = currentStep; }

    public int getRecommendedStep() { return recommendedStep; }
    public void setRecommendedStep(int recommendedStep) { this.recommendedStep = recommendedStep; }

    public int getRetryAfterHours() { return retryAfterHours; }
    public void setRetryAfterHours(int retryAfterHours) { this.retryAfterHours = retryAfterHours; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
