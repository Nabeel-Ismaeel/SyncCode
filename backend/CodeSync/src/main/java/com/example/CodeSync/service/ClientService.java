package com.example.CodeSync.service;

import com.example.CodeSync.dto.ShareProjectDto;
import com.example.CodeSync.model.Client;
import com.example.CodeSync.model.Project;
import com.example.CodeSync.repository.ClientRepo;
import com.example.CodeSync.repository.ProjectRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientService {

    @Autowired
    private ClientRepo clientRepo;
    @Autowired
    private ProjectRepo projectRepo;

    public List<Project> getEditProjects(String username) {
        Client client = clientRepo.findByUsername(username).get();
        return client
                .getEditProjectsID()
                .stream()
                .map(id -> projectRepo.findById(id).get())
                .collect(Collectors.toList());
    }

    public List<Project> getViewProjects(String username) {
        Client client = clientRepo.findByUsername(username).get();
        return client
                .getViewProjectsID()
                .stream()
                .map(id -> projectRepo.findById(id).get())
                .collect(Collectors.toList());
    }

    public void shareProjectWithEdit(ShareProjectDto shareProjectDto) {
        Project project = projectRepo.findById(shareProjectDto.getProjectID()).get();
        Client owner = clientRepo.findByUsername(shareProjectDto.getOwnerUsername()).get();
        Client targetClient = clientRepo.findByUsername(shareProjectDto.getTargetUsername()).get();
        if (owner.getClientID().equals(project.getOwnerId())) {
            targetClient.getEditProjectsID().add(shareProjectDto.getProjectID());
            clientRepo.save(targetClient);
            project.getEditors().add(targetClient.getClientID());
            projectRepo.save(project);
        } else {
            throw new IllegalArgumentException("You are not allowed to share this project");
        }
    }

    public void shareProjectWithView(ShareProjectDto shareProjectDto) {
        Project project = projectRepo.findById(shareProjectDto.getProjectID()).get();
        Client owner = clientRepo.findByUsername(shareProjectDto.getOwnerUsername()).get();
        Client targetClient = clientRepo.findByUsername(shareProjectDto.getTargetUsername()).get();
        if (owner.getClientID().equals(project.getOwnerId())) {
            targetClient.getViewProjectsID().add(shareProjectDto.getProjectID());
            clientRepo.save(targetClient);
            project.getViewers().add(targetClient.getClientID());
            projectRepo.save(project);
        } else {
            throw new IllegalArgumentException("You are not allowed to share this project");
        }
    }

}
