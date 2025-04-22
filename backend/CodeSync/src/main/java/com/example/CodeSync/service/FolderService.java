package com.example.CodeSync.service;

import com.example.CodeSync.dto.CreateItemDto;
import com.example.CodeSync.dto.PathDto;
import com.example.CodeSync.model.FolderItem;

import java.io.IOException;

public interface FolderService {
    void deleteFolder(PathDto pathDto) throws IOException;

    FolderItem createFolder(CreateItemDto createItemDto) throws IOException;

}
