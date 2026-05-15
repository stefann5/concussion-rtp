package com.ftn.sbnz.model.template;

public class MinStepDwellTemplate {
    private String contactLevel;
    private String historyFlag;
    private int minHours;

    public MinStepDwellTemplate() {}

    public MinStepDwellTemplate(String contactLevel, String historyFlag, int minHours) {
        this.contactLevel = contactLevel;
        this.historyFlag = historyFlag;
        this.minHours = minHours;
    }

    public String getContactLevel() { return contactLevel; }
    public void setContactLevel(String contactLevel) { this.contactLevel = contactLevel; }

    public String getHistoryFlag() { return historyFlag; }
    public void setHistoryFlag(String historyFlag) { this.historyFlag = historyFlag; }

    public int getMinHours() { return minHours; }
    public void setMinHours(int minHours) { this.minHours = minHours; }
}
