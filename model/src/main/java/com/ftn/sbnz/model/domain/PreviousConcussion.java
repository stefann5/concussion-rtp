package com.ftn.sbnz.model.domain;

import java.io.Serializable;
import java.time.LocalDate;

public class PreviousConcussion implements Serializable {
    private static final long serialVersionUID = 1L;

    private LocalDate date;
    private int recoveryDays;

    public PreviousConcussion() {}

    public PreviousConcussion(LocalDate date, int recoveryDays) {
        this.date = date;
        this.recoveryDays = recoveryDays;
    }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public int getRecoveryDays() { return recoveryDays; }
    public void setRecoveryDays(int recoveryDays) { this.recoveryDays = recoveryDays; }
}
