package com.example.CodeSync.controller;

import com.example.CodeSync.model.Project;
import com.example.CodeSync.model.ProjectStructure;
import com.example.CodeSync.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/project")
public class ProjectController {

    @Autowired
    private ProjectService defaultProjectService;

    @GetMapping("/create/{projectName}")
    public ResponseEntity<Project> createProject(@PathVariable String projectName, @RequestHeader("Authorization") String token) throws Exception {
        token = token.substring(7);
        Project project = defaultProjectService.createProject(projectName, token);
        return ResponseEntity.status(HttpStatus.OK).body(project);
    }

    @GetMapping("/delete/{projectID}")
    public ResponseEntity<String> deleteProject(@PathVariable String projectID, @RequestHeader("Authorization") String token) throws Exception {
        token = token.substring(7);
        defaultProjectService.removeProject(projectID, token);
        return ResponseEntity.status(HttpStatus.OK).body("Project deleted successfully");
    }

    @GetMapping("/projectStructure/{projectID}")
    public ProjectStructure loadProjectStructure(@PathVariable String projectID) throws Exception {
        return defaultProjectService.loadProjectStructure(projectID);
    }
}
