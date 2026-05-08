package com.ftn.sbnz.model.events;

import org.kie.api.definition.type.Expires;
import org.kie.api.definition.type.Role;
import org.kie.api.definition.type.Timestamp;

import java.io.Serializable;
import java.util.Date;

@Role(Role.Type.EVENT)
@Timestamp("timestamp")
@Expires("365d")
public class MedicalClearanceEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    private String athleteId;
    private int clearanceForStep;
    private String physicianId;
    private String note;
    private Date timestamp;

    public MedicalClearanceEvent() {}

    public MedicalClearanceEvent(String athleteId, int clearanceForStep, String physicianId, String note, Date timestamp) {
        this.athleteId = athleteId;
        this.clearanceForStep = clearanceForStep;
        this.physicianId = physicianId;
        this.note = note;
        this.timestamp = timestamp;
    }

    public String getAthleteId() { return athleteId; }
    public void setAthleteId(String athleteId) { this.athleteId = athleteId; }

    public int getClearanceForStep() { return clearanceForStep; }
    public void setClearanceForStep(int clearanceForStep) { this.clearanceForStep = clearanceForStep; }

    public String getPhysicianId() { return physicianId; }
    public void setPhysicianId(String physicianId) { this.physicianId = physicianId; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}
