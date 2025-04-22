package com.example.CodeSync.service.codeExecution;

import com.example.CodeSync.dto.RunCodeDto;

public interface CodePublisher {

    void sendCode(RunCodeDto runCodeDto);
}
