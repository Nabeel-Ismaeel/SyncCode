package com.example.CodeSync.model;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "projectStructure")
public class ProjectStructure {

    @Id
    private String id;
    private String projectID;
    private List<SnippetItem> files = new ArrayList<>();
    private List<FolderItem> folders = new ArrayList<>();
}
