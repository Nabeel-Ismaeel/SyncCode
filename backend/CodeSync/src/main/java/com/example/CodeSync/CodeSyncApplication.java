package com.example.CodeSync;

import com.example.CodeSync.enums.Role;
import com.example.CodeSync.model.Client;
import com.example.CodeSync.repository.ClientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class CodeSyncApplication implements CommandLineRunner {
    @Autowired
    private ClientRepo clientRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(CodeSyncApplication.class, args);
    }


    @Override
    public void run(String... args) throws Exception {
        clientRepo.save(Client
                .builder()
                .username("root")
                .password(passwordEncoder.encode("root"))
                .role(Role.ADMIN)
                .build());
        System.out.println("Admin logged in");
    }
}
