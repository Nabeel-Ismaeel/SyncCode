package com.example.CodeSync.service;

import com.example.CodeSync.model.Project;
import com.example.CodeSync.model.ProjectStructure;

import java.util.List;

public interface ProjectService {
    List<Project> getAllProjects();

    void removeProject(String projectID, String token) throws Exception;

    Project createProject(String projectName, String token) throws Exception;

    ProjectStructure loadProjectStructure(String projectID) throws Exception;
}
