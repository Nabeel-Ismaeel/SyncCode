package com.example.CodeSync.controller;

import com.example.CodeSync.dto.ShareProjectDto;
import com.example.CodeSync.model.Project;
import com.example.CodeSync.service.ClientService;
import com.example.CodeSync.service.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/client")
public class ClientController {

    @Autowired
    private JwtService jwtService;
    @Autowired
    private ClientService clientService;

    @GetMapping("/editProjects")
    public List<Project> getEditProjects(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtService.extractUserName(token);
        return clientService.getEditProjects(username);
    }

    @GetMapping("/viewProjects")
    public List<Project> getViewProjects(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtService.extractUserName(token);
        return clientService.getViewProjects(username);
    }

    @PostMapping("shareWithEdit")
    public String shareProjectWithEdit(@RequestBody ShareProjectDto shareProjectDto, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtService.extractUserName(token);
        shareProjectDto.setOwnerUsername(username);
        clientService.shareProjectWithEdit(shareProjectDto);
        return "Project shared successfully.";
    }

    @PostMapping("shareWithView")
    public String shareProjectWithView(@RequestBody ShareProjectDto shareProjectDto, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtService.extractUserName(token);
        shareProjectDto.setOwnerUsername(username);
        clientService.shareProjectWithView(shareProjectDto);
        return "Project shared successfully.";
    }

}
