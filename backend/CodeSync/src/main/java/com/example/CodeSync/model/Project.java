package com.example.CodeSync.model;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "projects")

public class Project {

    @Id
    private String id;
    private String name;
    private String path;
    private Long ownerId;
    private List<Long> viewers;
    private List<Long> editors;
}
