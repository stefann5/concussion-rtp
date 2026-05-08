package com.ftn.sbnz.model.facts;

import org.kie.api.definition.type.Position;

import java.io.Serializable;

public class ParentCategory implements Serializable {
    private static final long serialVersionUID = 1L;

    @Position(0)
    private String child;

    @Position(1)
    private String parent;

    public ParentCategory() {}

    public ParentCategory(String child, String parent) {
        this.child = child;
        this.parent = parent;
    }

    public String getChild() { return child; }
    public void setChild(String child) { this.child = child; }

    public String getParent() { return parent; }
    public void setParent(String parent) { this.parent = parent; }
}
