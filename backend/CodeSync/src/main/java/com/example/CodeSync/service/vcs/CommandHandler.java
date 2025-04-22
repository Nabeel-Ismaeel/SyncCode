package com.example.CodeSync.service.vcs;

import com.example.CodeSync.dto.CommandDto;

public interface CommandHandler {
    String execute(CommandDto commandDto) throws Exception;
}
