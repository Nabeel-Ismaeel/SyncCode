package com.example.CodeSync.service;

import com.example.CodeSync.model.ProjectStructure;

public interface ProjectStructureService {
    ProjectStructure createProjectStructure();

    void deleteProjectStructure(String projectStructureId);

    ProjectStructure createProjectStructure(String projectID);

    ProjectStructure getProjectStructure(String projectStructureId);

    ProjectStructure createCopyProjectStructure(String projectStructureID);
}
