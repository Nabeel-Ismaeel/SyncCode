package com.example.CodeSync.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ShareProjectDto {
    private String projectID;
    private String ownerUsername;
    private String targetUsername;
}
