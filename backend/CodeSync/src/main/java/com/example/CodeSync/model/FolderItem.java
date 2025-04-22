package com.example.CodeSync.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class FolderItem {
    private String name;
    private String path;
    private List<SnippetItem> files;
    private List<FolderItem> folders;
}
