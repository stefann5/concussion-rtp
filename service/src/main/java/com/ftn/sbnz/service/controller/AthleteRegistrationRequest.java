package com.ftn.sbnz.service.controller;

import com.ftn.sbnz.model.domain.Athlete;

public class AthleteRegistrationRequest {
    private Athlete athlete;
    private String username;
    private String password;

    public AthleteRegistrationRequest() {}

    public Athlete getAthlete() { return athlete; }
    public void setAthlete(Athlete athlete) { this.athlete = athlete; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
