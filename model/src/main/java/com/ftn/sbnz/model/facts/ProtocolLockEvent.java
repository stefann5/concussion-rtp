package com.ftn.sbnz.model.facts;

import java.io.Serializable;
import java.util.Date;

public class ProtocolLockEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    private String athleteId;
    private int lockUntilHours;
    private String reason;
    private Date lockedAt;

    public ProtocolLockEvent() {}

    public ProtocolLockEvent(String athleteId, int lockUntilHours, String reason, Date lockedAt) {
        this.athleteId = athleteId;
        this.lockUntilHours = lockUntilHours;
        this.reason = reason;
        this.lockedAt = lockedAt;
    }

    public String getAthleteId() { return athleteId; }
    public void setAthleteId(String athleteId) { this.athleteId = athleteId; }

    public int getLockUntilHours() { return lockUntilHours; }
    public void setLockUntilHours(int lockUntilHours) { this.lockUntilHours = lockUntilHours; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Date getLockedAt() { return lockedAt; }
    public void setLockedAt(Date lockedAt) { this.lockedAt = lockedAt; }
}
