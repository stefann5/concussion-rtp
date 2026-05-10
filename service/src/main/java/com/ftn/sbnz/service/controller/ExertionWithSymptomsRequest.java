package com.ftn.sbnz.service.controller;

import com.ftn.sbnz.model.events.ExertionAttemptEvent;
import com.ftn.sbnz.model.events.SymptomDuringExertionEvent;

import java.util.List;

public class ExertionWithSymptomsRequest {
    private ExertionAttemptEvent exertion;
    private List<SymptomDuringExertionEvent> symptoms;

    public ExertionAttemptEvent getExertion() { return exertion; }
    public void setExertion(ExertionAttemptEvent exertion) { this.exertion = exertion; }

    public List<SymptomDuringExertionEvent> getSymptoms() { return symptoms; }
    public void setSymptoms(List<SymptomDuringExertionEvent> symptoms) { this.symptoms = symptoms; }
}
