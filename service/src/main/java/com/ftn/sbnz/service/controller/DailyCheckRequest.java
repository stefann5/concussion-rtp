package com.ftn.sbnz.service.controller;

import java.util.Map;

public class DailyCheckRequest {
    private String athleteId;
    private Map<String, Integer> levels;

    public String getAthleteId() { return athleteId; }
    public void setAthleteId(String athleteId) { this.athleteId = athleteId; }

    public Map<String, Integer> getLevels() { return levels; }
    public void setLevels(Map<String, Integer> levels) { this.levels = levels; }
}
