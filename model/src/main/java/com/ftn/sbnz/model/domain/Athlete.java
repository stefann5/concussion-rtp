package com.ftn.sbnz.model.domain;

import com.ftn.sbnz.model.enums.AgeGroup;
import com.ftn.sbnz.model.enums.ContactLevel;
import com.ftn.sbnz.model.enums.HistoryFlag;
import com.ftn.sbnz.model.enums.Sex;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Athlete implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String name;
    private int age;
    private Sex sex;
    private String sport;
    private String position;
    private String competitionLevel;

    private ContactLevel contactLevel;
    private AgeGroup ageGroup;
    private HistoryFlag historyFlag;

    private RiskFactors riskFactors = new RiskFactors();
    private List<PreviousConcussion> previousConcussions = new ArrayList<>();
    private Map<String, Integer> baselineSymptoms = new HashMap<>();

    private int currentStep;
    private LocalDateTime stepEnteredAt;
    private LocalDateTime injuryAt;

    public Athlete() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public Sex getSex() { return sex; }
    public void setSex(Sex sex) { this.sex = sex; }

    public String getSport() { return sport; }
    public void setSport(String sport) { this.sport = sport; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getCompetitionLevel() { return competitionLevel; }
    public void setCompetitionLevel(String competitionLevel) { this.competitionLevel = competitionLevel; }

    public ContactLevel getContactLevel() { return contactLevel; }
    public void setContactLevel(ContactLevel contactLevel) { this.contactLevel = contactLevel; }

    public AgeGroup getAgeGroup() { return ageGroup; }
    public void setAgeGroup(AgeGroup ageGroup) { this.ageGroup = ageGroup; }

    public HistoryFlag getHistoryFlag() { return historyFlag; }
    public void setHistoryFlag(HistoryFlag historyFlag) { this.historyFlag = historyFlag; }

    public RiskFactors getRiskFactors() { return riskFactors; }
    public void setRiskFactors(RiskFactors riskFactors) { this.riskFactors = riskFactors; }

    public List<PreviousConcussion> getPreviousConcussions() { return previousConcussions; }
    public void setPreviousConcussions(List<PreviousConcussion> previousConcussions) { this.previousConcussions = previousConcussions; }

    public Map<String, Integer> getBaselineSymptoms() { return baselineSymptoms; }
    public void setBaselineSymptoms(Map<String, Integer> baselineSymptoms) { this.baselineSymptoms = baselineSymptoms; }

    public int getCurrentStep() { return currentStep; }
    public void setCurrentStep(int currentStep) { this.currentStep = currentStep; }

    public LocalDateTime getStepEnteredAt() { return stepEnteredAt; }
    public void setStepEnteredAt(LocalDateTime stepEnteredAt) { this.stepEnteredAt = stepEnteredAt; }

    public LocalDateTime getInjuryAt() { return injuryAt; }
    public void setInjuryAt(LocalDateTime injuryAt) { this.injuryAt = injuryAt; }

    public int baselineFor(String symptom) {
        return baselineSymptoms.getOrDefault(symptom, 0);
    }
}
