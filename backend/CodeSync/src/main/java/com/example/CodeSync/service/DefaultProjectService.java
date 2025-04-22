package com.example.CodeSync.service;

import com.example.CodeSync.enums.Role;
import com.example.CodeSync.model.Client;
import com.example.CodeSync.model.Project;
import com.example.CodeSync.model.ProjectStructure;
import com.example.CodeSync.repository.ClientRepo;
import com.example.CodeSync.repository.ProjectRepo;
import com.example.CodeSync.service.security.JwtService;
import com.example.CodeSync.service.storageService.ProjectStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class DefaultProjectService implements ProjectService {


    @Autowired
    private JwtService jwtService;
    @Autowired
    private ClientRepo clientRepo;
    @Autowired
    private ProjectRepo projectRepo;
    @Autowired
    private ProjectStorage defaultProjectStorage;
    @Autowired
    private ProjectStructureService defaultProjectStructureService;

    public List<Project> getAllProjects() {
        return projectRepo.findAll();
    }

    @Transactional
    public Project createProject(String projectName, String token) throws Exception {
        String username = jwtService.extractUserName(token);
        Client client = clientRepo.findByUsername(username).get();

        Project project = Project
                .builder()
                .name(projectName)
                .viewers(new ArrayList<>())
                .ownerId(client.getClientID())
                .editors(List.of(client.getClientID()))
                .build();
        project = projectRepo.save(project);
        project.setPath(project.getId());
        project = projectRepo.save(project);

        List<String> editProjectsID = client.getEditProjectsID();
        editProjectsID.add(project.getId());
        client.setEditProjectsID(editProjectsID);
        clientRepo.save(client);
        defaultProjectStorage.creteProject(project.getId());
        return project;
    }

    @Transactional
    public void removeProject(String projectID, String token) throws Exception {
        String username = jwtService.extractUserName(token);
        Project project = projectRepo.findById(projectID).get();
        Client client = clientRepo.findByUsername(username).get();

        if (project.getOwnerId().equals(client.getClientID()) || client.getRole().equals(Role.ADMIN)) {
            project.getEditors().forEach(editorID -> {
                Client editor = clientRepo.findById(editorID).get();
                List<String> editProjectsID = editor.getEditProjectsID();
                editProjectsID.remove(projectID);
                editor.setEditProjectsID(editProjectsID);
                clientRepo.save(editor);
            });

            project.getViewers().forEach(viewerID -> {
                Client viewer = clientRepo.findById(viewerID).get();
                List<String> viewProjectsID = viewer.getViewProjectsID();
                viewProjectsID.remove(projectID);
                viewer.setViewProjectsID(viewProjectsID);
                clientRepo.save(viewer);
            });
            projectRepo.deleteById(projectID);
            defaultProjectStorage.deleteProject(projectID);
        } else {
            List<Long> editorsID = project.getEditors();
            editorsID.remove(client.getClientID());
            project.setEditors(editorsID);

            List<Long> viewersID = project.getViewers();
            viewersID.remove(client.getClientID());
            project.setViewers(viewersID);
            projectRepo.save(project);

            List<String> projectsID = client.getViewProjectsID();
            projectsID.remove(projectID);
            client.setViewProjectsID(projectsID);
            projectsID = client.getEditProjectsID();
            projectsID.remove(projectID);
            client.setEditProjectsID(projectsID);
            clientRepo.save(client);
        }
    }

    public ProjectStructure loadProjectStructure(String projectID) throws Exception {
        String projectStructureID = defaultProjectStorage.getProjectStructureID(projectID);
        return defaultProjectStructureService.getProjectStructure(projectStructureID);
    }
}
