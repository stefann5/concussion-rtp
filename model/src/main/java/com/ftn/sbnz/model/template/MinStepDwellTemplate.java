package com.ftn.sbnz.model.template;

public class MinStepDwellTemplate {
    private String ageGroup;
    private String contactLevel;
    private String historyFlag;
    private int minHours;

    public MinStepDwellTemplate() {}

    public MinStepDwellTemplate(String ageGroup, String contactLevel, String historyFlag, int minHours) {
        this.ageGroup = ageGroup;
        this.contactLevel = contactLevel;
        this.historyFlag = historyFlag;
        this.minHours = minHours;
    }

    public String getAgeGroup() { return ageGroup; }
    public void setAgeGroup(String ageGroup) { this.ageGroup = ageGroup; }

    public String getContactLevel() { return contactLevel; }
    public void setContactLevel(String contactLevel) { this.contactLevel = contactLevel; }

    public String getHistoryFlag() { return historyFlag; }
    public void setHistoryFlag(String historyFlag) { this.historyFlag = historyFlag; }

    public int getMinHours() { return minHours; }
    public void setMinHours(int minHours) { this.minHours = minHours; }
}
