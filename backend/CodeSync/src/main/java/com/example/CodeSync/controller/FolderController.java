package com.example.CodeSync.controller;

import com.example.CodeSync.dto.CreateItemDto;
import com.example.CodeSync.dto.PathDto;
import com.example.CodeSync.model.FolderItem;
import com.example.CodeSync.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/folder")
public class FolderController {

    @Autowired
    private FolderService defaultFolderService;

    @PostMapping("/create")
    public FolderItem createFolder(@RequestBody CreateItemDto createItemDto) throws IOException {
        return defaultFolderService.createFolder(createItemDto);
    }

    @PostMapping("/delete")
    public void removeFolder(@RequestBody PathDto pathDto) throws IOException {
        defaultFolderService.deleteFolder(pathDto);
    }
}
