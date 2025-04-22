package com.example.CodeSync.controller;

import com.example.CodeSync.dto.RunCodeDto;
import com.example.CodeSync.service.codeExecution.CodePublisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/code")
public class CodeExecutionController {

    @Autowired
    private CodePublisher defaultCodePublisher;

    @PostMapping("/run")
    public void runCode(@RequestBody RunCodeDto runCodeDto) {
        defaultCodePublisher.sendCode(runCodeDto);
    }
}
