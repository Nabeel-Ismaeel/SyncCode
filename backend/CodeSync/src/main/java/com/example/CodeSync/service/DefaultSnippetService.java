package com.example.CodeSync.service;

import com.example.CodeSync.dto.CreateItemDto;
import com.example.CodeSync.dto.PathDto;
import com.example.CodeSync.dto.SnippetDto;
import com.example.CodeSync.model.FolderItem;
import com.example.CodeSync.model.ProjectStructure;
import com.example.CodeSync.model.SnippetItem;
import com.example.CodeSync.repository.ProjectStructureRepo;
import com.example.CodeSync.service.storageService.ProjectStorage;
import com.example.CodeSync.service.storageService.SnippetStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

@Service
public class DefaultSnippetService implements SnippetService {

    @Autowired
    private ProjectStorage defaultProjectStorage;
    @Autowired
    private SnippetStorage defaultSnippetStorage;
    @Autowired
    private ProjectStructureRepo projectStructureRepo;
    @Autowired
    private ProjectStructureService defaultProjectStructureService;


    @Transactional
    public SnippetItem createSnippet(CreateItemDto createItemDto) throws Exception {
        String projectID = Arrays.asList(createItemDto.getParentPath().split("\\\\")).get(0);
        String projectStructureID = defaultProjectStorage.getProjectStructureID(projectID);
        ProjectStructure projectStructure = defaultProjectStructureService.getProjectStructure(projectStructureID);

        List<SnippetItem> snippets = getParentSnippets(projectStructure, createItemDto.getParentPath());

        for (SnippetItem snippet : snippets) {
            if (snippet.getName().equals(createItemDto.getName())) {
                throw new IllegalArgumentException("File Name already exists");
            }
        }

        SnippetItem snippet = defaultSnippetStorage.createSnippet(createItemDto.getName(), createItemDto.getParentPath());
        snippets.add(snippet);
        projectStructureRepo.save(projectStructure);
        return snippet;
    }


    @Transactional
    public void deleteSnippet(PathDto pathDto) throws Exception {
        List<String> path = new ArrayList<>(Arrays.asList(pathDto.getPath().split("\\\\")));
        String projectID = path.get(0);
        String snippetName = path.get(path.size() - 1);
        String projectStructureID = defaultProjectStorage.getProjectStructureID(projectID);
        ProjectStructure projectStructure = defaultProjectStructureService.getProjectStructure(projectStructureID);

        SnippetItem snippetItem = null;
        path.remove(path.size() - 1);
        String parentPath = String.join("\\", path);
        List<SnippetItem> snippets = getParentSnippets(projectStructure, parentPath);

        boolean isFound = false;
        Iterator<SnippetItem> iterator = snippets.iterator();
        while (iterator.hasNext()) {
            SnippetItem snippet = iterator.next();
            if (snippet.getName().equals(snippetName)) {
                snippetItem = snippet;
                iterator.remove();
                isFound = true;
                break;
            }
        }

        if (!isFound) {
            throw new IllegalArgumentException("Snippet not found");
        }
        projectStructureRepo.save(projectStructure);
        defaultSnippetStorage.removeSnippet(snippetItem);
    }

    private List<SnippetItem> getParentSnippets(ProjectStructure projectStructure, String parentPath) {
        List<String> path = Arrays.asList(parentPath.split("\\\\"));
        if (path.size() == 1) {
            return projectStructure.getFiles();
        }
        List<FolderItem> folders = projectStructure.getFolders();

        for (int i = 1; i < path.size(); i++) {
            boolean isFound = false;
            for (FolderItem folder : folders) {
                if (folder.getName().equals(path.get(i))) {
                    if (i == path.size() - 1) {
                        return folder.getFiles();
                    }
                    folders = folder.getFolders();
                    isFound = true;
                    break;
                }
            }
            if (!isFound) {
                throw new IllegalArgumentException("Not valid path");
            }
        }
        throw new IllegalArgumentException("Not valid path");
    }

    public void updateSnippet(SnippetDto snippetDto) throws Exception {
        defaultSnippetStorage.updateSnippet(snippetDto);
    }

    public String loadSnippetContent(SnippetDto snippetDto) throws Exception {
        return defaultSnippetStorage.getSnippetContent(snippetDto);
    }
}
