package com.example.CodeSync.service.snowflake;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SnowFlakeID implements IdGenerator {
    private static final Map<Long, SnowFlakeNode> threadLastData = new ConcurrentHashMap<>();
    private static final Long defultTimestamp = 1704432000000L;
    private static final Long maxStep = 12L;

    public String generate() {
        long threadId = Thread.currentThread().getId();
        Long currentTimestamp = getCurrentTimestamp();
        if (!threadLastData.containsKey(threadId)) {
            threadLastData.put(threadId, new SnowFlakeNode(0L, 0L));
        }
        if (currentTimestamp.equals(threadLastData.get(threadId).getTimestamp())) {
            threadLastData.get(threadId).setStep(threadLastData.get(threadId).getStep() + 1);
            if (threadLastData.get(threadId).getStep() > ((1L << (maxStep + 1)) - 1)) {
                threadLastData.get(threadId).setStep(0L);
                try {
                    Thread.sleep(1);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
                currentTimestamp = getCurrentTimestamp();
            }
        } else {
            threadLastData.get(threadId).setStep(0L);
        }

        threadLastData.get(threadId).setTimestamp(currentTimestamp);
        Long id = (currentTimestamp << 22) | (threadId << 12) | threadLastData.get(threadId).getStep();
        return String.valueOf(id);
    }

    private Long getCurrentTimestamp() {
        return Instant.now().toEpochMilli() - defultTimestamp;
    }
}
