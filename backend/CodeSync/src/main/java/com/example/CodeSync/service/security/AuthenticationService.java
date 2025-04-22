package com.example.CodeSync.service.security;

import com.example.CodeSync.dto.JwtResponse;
import com.example.CodeSync.model.Client;
import com.example.CodeSync.repository.ClientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class AuthenticationService {

    @Autowired
    private JwtService jwtService;
    @Autowired
    private ClientRepo clientRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;

    public String register(Client client) {
        Optional<Client> retrievedClient = clientRepo.findByUsername(client.getUsername());
        if (retrievedClient.isEmpty()) {
            client.setPassword(passwordEncoder.encode(client.getPassword()));
            clientRepo.save(client);
            return "Successfully registered";
        } else {
            throw new IllegalArgumentException("Username already in use");
        }
    }

    public JwtResponse verify(Client client) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(client.getUsername(), client.getPassword()));
        if (authentication.isAuthenticated()) {
            if (clientRepo.findByUsername(client.getUsername()).get().getRole().equals(client.getRole())) {
                return JwtResponse
                        .builder()
                        .accessToken(jwtService.generateAccessToken(client.getUsername()))
                        .refreshToken(jwtService.generateRefreshToken(client.getUsername()))
                        .build();
            }
            throw new IllegalArgumentException("Invalid username or password");
        }
        throw new IllegalArgumentException("Invalid username or password");
    }

}
