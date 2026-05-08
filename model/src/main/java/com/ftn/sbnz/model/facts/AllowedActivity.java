package com.ftn.sbnz.model.facts;

import java.io.Serializable;

public class AllowedActivity implements Serializable {
    private static final long serialVersionUID = 1L;

    private int step;
    private String allowedCategory;
    private String sourceCitation;

    public AllowedActivity() {}

    public AllowedActivity(int step, String allowedCategory, String sourceCitation) {
        this.step = step;
        this.allowedCategory = allowedCategory;
        this.sourceCitation = sourceCitation;
    }

    public int getStep() { return step; }
    public void setStep(int step) { this.step = step; }

    public String getAllowedCategory() { return allowedCategory; }
    public void setAllowedCategory(String allowedCategory) { this.allowedCategory = allowedCategory; }

    public String getSourceCitation() { return sourceCitation; }
    public void setSourceCitation(String sourceCitation) { this.sourceCitation = sourceCitation; }
}
