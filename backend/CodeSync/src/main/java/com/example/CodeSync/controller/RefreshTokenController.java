package com.example.CodeSync.controller;

import com.example.CodeSync.service.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/refreshToken")
public class RefreshTokenController {
    @Autowired
    private JwtService jwtService;

    @GetMapping("/generateToken")
    public String refreshToken(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtService.extractUserName(token);
        return jwtService.generateAccessToken(username);
    }
}
