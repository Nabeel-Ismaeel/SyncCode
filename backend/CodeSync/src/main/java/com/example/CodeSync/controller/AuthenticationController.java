package com.example.CodeSync.controller;

import com.example.CodeSync.dto.JwtResponse;
import com.example.CodeSync.enums.Role;
import com.example.CodeSync.model.Client;
import com.example.CodeSync.service.security.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/register")
    public String register(@RequestBody Client client) {
        client.setRole(Role.USER);
        return authenticationService.register(client);
    }

    @PostMapping("/login")
    public JwtResponse login(@RequestBody Client client) {
        return authenticationService.verify(client);
    }
}
