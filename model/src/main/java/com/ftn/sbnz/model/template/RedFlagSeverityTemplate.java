package com.ftn.sbnz.model.template;

public class RedFlagSeverityTemplate {
    private String flagType;
    private String severity;
    private int salienceLevel;
    private String actionType;

    public RedFlagSeverityTemplate() {}

    public RedFlagSeverityTemplate(String flagType, String severity, int salienceLevel, String actionType) {
        this.flagType = flagType;
        this.severity = severity;
        this.salienceLevel = salienceLevel;
        this.actionType = actionType;
    }

    public String getFlagType() { return flagType; }
    public void setFlagType(String flagType) { this.flagType = flagType; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public int getSalienceLevel() { return salienceLevel; }
    public void setSalienceLevel(int salienceLevel) { this.salienceLevel = salienceLevel; }

    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }
}
