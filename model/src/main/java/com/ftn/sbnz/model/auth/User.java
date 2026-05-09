package com.ftn.sbnz.model.auth;

import java.io.Serializable;

public class User implements Serializable {
    private static final long serialVersionUID = 1L;

    private String username;
    private String passwordHash;
    private Role role;
    private String linkedAthleteId;
    private String displayName;

    public User() {}

    public User(String username, String passwordHash, Role role, String displayName, String linkedAthleteId) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
        this.displayName = displayName;
        this.linkedAthleteId = linkedAthleteId;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getLinkedAthleteId() { return linkedAthleteId; }
    public void setLinkedAthleteId(String linkedAthleteId) { this.linkedAthleteId = linkedAthleteId; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
}
