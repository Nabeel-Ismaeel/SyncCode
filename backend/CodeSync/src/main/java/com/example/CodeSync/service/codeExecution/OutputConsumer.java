package com.example.CodeSync.service.codeExecution;

import com.example.CodeSync.dto.OutputMessage;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class OutputConsumer {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @RabbitListener(queues = {"outputQueue"})
    public void consume(OutputMessage outputMessage) {
        try {
            System.out.println(outputMessage);
            messagingTemplate.convertAndSend("/topic/output/" + outputMessage.getClientToken(), outputMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
