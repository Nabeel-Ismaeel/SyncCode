package com.example.CodeSync.service;

import com.example.CodeSync.dto.CreateItemDto;
import com.example.CodeSync.dto.PathDto;
import com.example.CodeSync.dto.SnippetDto;
import com.example.CodeSync.model.SnippetItem;

public interface SnippetService {
    void deleteSnippet(PathDto pathDto) throws Exception;

    void updateSnippet(SnippetDto snippetDto) throws Exception;

    String loadSnippetContent(SnippetDto snippetDto) throws Exception;

    SnippetItem createSnippet(CreateItemDto createItemDto) throws Exception;
}
