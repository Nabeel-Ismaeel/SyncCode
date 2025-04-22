package com.example.CodeSync.model;

import com.example.CodeSync.enums.Language;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class SnippetItem {
    private String id;
    private String path;
    private String name;
    private Language language;
}
