package com.example.CodeSync.controller;

import com.example.CodeSync.enums.Role;
import com.example.CodeSync.model.Client;
import com.example.CodeSync.model.Project;
import com.example.CodeSync.service.DefaultProjectService;
import com.example.CodeSync.service.security.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private DefaultProjectService defaultProjectService;
    @Autowired
    private AuthenticationService authenticationService;

    @GetMapping("/allProject")
    public List<Project> getAllProjects() {
        return defaultProjectService.getAllProjects();
    }

    @PostMapping("/register")
    public String register(@RequestBody Client client) {
        client.setRole(Role.ADMIN);
        return authenticationService.register(client);
    }
}
