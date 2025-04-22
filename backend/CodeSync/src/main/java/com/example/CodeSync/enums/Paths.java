package com.example.CodeSync.enums;

public enum Paths {
    Project_Paths(".\\src\\main\\resources\\projects");

    private String path;

    Paths(String path) {
        this.path = path;
    }

    public String getPath() {
        return path;
    }
}
