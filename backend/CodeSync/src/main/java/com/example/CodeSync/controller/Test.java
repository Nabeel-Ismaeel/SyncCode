package com.example.CodeSync.controller;

import com.example.CodeSync.service.vcs.VcsStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class Test {

    @Autowired
    private VcsStorageService vcsStorageService;

    @GetMapping("/test")
    public String test() throws Exception {
        return vcsStorageService.checkout("67f680cb42da6928eb00d05d" , "test");
    }
}


