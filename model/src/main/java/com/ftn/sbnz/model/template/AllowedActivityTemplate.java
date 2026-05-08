package com.ftn.sbnz.model.template;

public class AllowedActivityTemplate {
    private int step;
    private String allowedCategory;
    private String sourceCitation;

    public AllowedActivityTemplate() {}

    public AllowedActivityTemplate(int step, String allowedCategory, String sourceCitation) {
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
