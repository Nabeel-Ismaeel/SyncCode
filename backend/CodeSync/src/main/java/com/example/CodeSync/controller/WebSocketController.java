package com.example.CodeSync.controller;

import com.example.CodeSync.dto.RunCodeDto;
import com.example.CodeSync.dto.UpdateDto;
import com.example.CodeSync.service.codeExecution.CodePublisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

    @Controller
    public class WebSocketController {
    
        @Autowired
        private CodePublisher defaultCodePublisher;
        @Autowired
        private SimpMessagingTemplate messagingTemplate;
    
        @MessageMapping("/sendCode")
        public void handleCode(RunCodeDto runCodeDto) {
            defaultCodePublisher.sendCode(runCodeDto);
        }
    
        @MessageMapping("/editor/change")
        public void handleChange(UpdateDto updateDto) {
            messagingTemplate.convertAndSend("/topic/editor/" + updateDto.getSnippetID(), updateDto);
        }
    }
