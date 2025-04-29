package com.example.CodeSync.service.codeExecution;

import com.example.CodeSync.dto.CodeMessage;
import com.example.CodeSync.dto.RunCodeDto;
import com.example.CodeSync.enums.MessageQueueConstants;
import com.example.CodeSync.utility.LanguageDetector;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DefaultCodePublisher implements CodePublisher {
    @Autowired
    private RabbitTemplate rabbitTemplate;
    @Autowired
    private LanguageDetector languageDetector;

    public void sendCode(RunCodeDto runCodeDto) {
        CodeMessage codeMessage = CodeMessage
                .builder()
                .code(runCodeDto.getCode())
                .clientToken(runCodeDto.getClientToken())
                .language(languageDetector
                        .detectLanguage(runCodeDto.getSnippetName())
                        .toString())
                .build();
        System.out.println("test websocket message");
        rabbitTemplate.convertAndSend(MessageQueueConstants.EXCHANGE_NAME.getValue(),
                MessageQueueConstants.CODE_KEY.getValue(),
                codeMessage);
    }
}
