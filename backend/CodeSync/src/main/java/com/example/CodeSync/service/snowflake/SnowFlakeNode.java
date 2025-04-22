package com.example.CodeSync.service.snowflake;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SnowFlakeNode {
    private Long step;
    private Long timestamp;
}