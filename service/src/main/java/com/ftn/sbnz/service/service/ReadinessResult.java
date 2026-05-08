package com.ftn.sbnz.service.service;

import java.util.List;

public class ReadinessResult {
    private boolean ready;
    private List<String> unmetConditions;

    public ReadinessResult() {}

    public ReadinessResult(boolean ready, List<String> unmetConditions) {
        this.ready = ready;
        this.unmetConditions = unmetConditions;
    }

    public boolean isReady() { return ready; }
    public void setReady(boolean ready) { this.ready = ready; }

    public List<String> getUnmetConditions() { return unmetConditions; }
    public void setUnmetConditions(List<String> unmetConditions) { this.unmetConditions = unmetConditions; }
}
