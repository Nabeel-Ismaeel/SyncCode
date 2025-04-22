package com.example.CodeSync.service.storageService;

import java.io.IOException;

public interface ProjectStorage {
    void creteProject(String projectID) throws Exception;

    void deleteProject(String projectID) throws Exception;

    String getProjectStructureID(String projectID) throws IOException;
}
