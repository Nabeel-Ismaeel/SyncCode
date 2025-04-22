package com.example.CodeSync.controller;

import com.example.CodeSync.dto.CommandDto;
import com.example.CodeSync.service.vcs.DefaultCommandHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/vcs")
public class VcsController {

    @Autowired
    private DefaultCommandHandler defaultCommandHandler;

    @PostMapping
    public String vcs(@RequestBody CommandDto commandDto) throws Exception {
        return defaultCommandHandler.execute(commandDto);
    }
}
