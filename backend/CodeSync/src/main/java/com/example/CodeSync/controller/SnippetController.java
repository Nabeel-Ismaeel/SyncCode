package com.example.CodeSync.controller;

import com.example.CodeSync.dto.CreateItemDto;
import com.example.CodeSync.dto.PathDto;
import com.example.CodeSync.dto.SnippetDto;
import com.example.CodeSync.model.SnippetItem;
import com.example.CodeSync.service.SnippetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/snippet")
public class SnippetController {

    @Autowired
    private SnippetService defaultSnippetService;

    @PostMapping("/create")
    public SnippetItem createSnippet(@RequestBody CreateItemDto createItemDto) throws Exception {
        return defaultSnippetService.createSnippet(createItemDto);
    }

    @PostMapping("/delete")
    public void deleteSnippet(@RequestBody PathDto pathDto) throws Exception {
        defaultSnippetService.deleteSnippet(pathDto);
    }

    @PostMapping("/update")
    public void updateSnippet(@RequestBody SnippetDto snippetDto) throws Exception {
        defaultSnippetService.updateSnippet(snippetDto);
    }

    @PostMapping("/load")
    public String loadSnippetContent(@RequestBody SnippetDto snippetDto) throws Exception {
        return defaultSnippetService.loadSnippetContent(snippetDto);
    }
}
