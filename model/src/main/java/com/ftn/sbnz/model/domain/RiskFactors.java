package com.ftn.sbnz.model.domain;

import java.io.Serializable;

public class RiskFactors implements Serializable {
    private static final long serialVersionUID = 1L;

    private boolean migraine;
    private boolean adhd;
    private boolean anxiety;
    private boolean learningDifficulties;
    private boolean mentalHealthHistory;
    private boolean sleepDisorder;

    public RiskFactors() {}

    public boolean isMigraine() { return migraine; }
    public void setMigraine(boolean migraine) { this.migraine = migraine; }

    public boolean isAdhd() { return adhd; }
    public void setAdhd(boolean adhd) { this.adhd = adhd; }

    public boolean isAnxiety() { return anxiety; }
    public void setAnxiety(boolean anxiety) { this.anxiety = anxiety; }

    public boolean isLearningDifficulties() { return learningDifficulties; }
    public void setLearningDifficulties(boolean learningDifficulties) { this.learningDifficulties = learningDifficulties; }

    public boolean isMentalHealthHistory() { return mentalHealthHistory; }
    public void setMentalHealthHistory(boolean mentalHealthHistory) { this.mentalHealthHistory = mentalHealthHistory; }

    public boolean isSleepDisorder() { return sleepDisorder; }
    public void setSleepDisorder(boolean sleepDisorder) { this.sleepDisorder = sleepDisorder; }
}
