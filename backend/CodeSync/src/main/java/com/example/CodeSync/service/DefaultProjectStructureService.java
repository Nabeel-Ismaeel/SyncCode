package com.example.CodeSync.service;

import com.example.CodeSync.model.ProjectStructure;
import com.example.CodeSync.repository.ProjectStructureRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DefaultProjectStructureService implements ProjectStructureService {

    @Autowired
    private ProjectStructureRepo projectStructureRepo;

    public ProjectStructure createProjectStructure() {
        return projectStructureRepo.save(new ProjectStructure());
    }

    public ProjectStructure createProjectStructure(String projectID) {
        ProjectStructure projectStructure = new ProjectStructure();
        projectStructure.setProjectID(projectID);
        return projectStructureRepo.save(projectStructure);
    }


    public void deleteProjectStructure(String projectStructureId) {
        projectStructureRepo.deleteById(projectStructureId);
    }

    public ProjectStructure getProjectStructure(String projectStructureId) {
        Optional<ProjectStructure> projectStructure = projectStructureRepo.findById(projectStructureId);
        if (projectStructure.isEmpty()) {
            throw new IllegalArgumentException("Project structure not found");
        }
        return projectStructure.get();
    }


    public ProjectStructure createCopyProjectStructure(String projectStructureID) {
        ProjectStructure projectStructure = projectStructureRepo.findById(projectStructureID).get();
        ProjectStructure copyProjectStructure = ProjectStructure
                .builder()
                .files(projectStructure.getFiles())
                .folders(projectStructure.getFolders())
                .projectID(projectStructure.getProjectID())
                .build();
        return projectStructureRepo.save(copyProjectStructure);
    }
}
