package com.example.CodeSync.service.storageService;

import com.example.CodeSync.dto.SnippetDto;
import com.example.CodeSync.model.SnippetItem;

public interface SnippetStorage {
    void updateSnippet(SnippetDto snippetDto) throws Exception;

    void removeSnippet(SnippetItem snippetItem) throws Exception;

    String getSnippetContent(SnippetDto snippetDto) throws Exception;

    SnippetItem createSnippet(String name, String parentPath) throws Exception;
}
