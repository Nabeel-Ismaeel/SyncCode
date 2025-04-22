package com.example.CodeSync.service;

import com.example.CodeSync.dto.CreateItemDto;
import com.example.CodeSync.dto.PathDto;
import com.example.CodeSync.model.FolderItem;
import com.example.CodeSync.model.ProjectStructure;
import com.example.CodeSync.repository.ProjectStructureRepo;
import com.example.CodeSync.service.storageService.ProjectStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

@Service
public class DefaultFolderService implements FolderService {

    @Autowired
    private ProjectStorage defaultProjectStorage;
    @Autowired
    private ProjectStructureRepo projectStructureRepo;
    @Autowired
    private ProjectStructureService defaultProjectStructureService;

    public FolderItem createFolder(CreateItemDto createItemDto) throws IOException {
        String projectID = Arrays.asList(createItemDto.getParentPath().split("\\\\")).get(0);
        String projectStructureID = defaultProjectStorage.getProjectStructureID(projectID);
        ProjectStructure projectStructure = defaultProjectStructureService.getProjectStructure(projectStructureID);
        List<FolderItem> folders = getParentFolders(projectStructure, createItemDto.getParentPath());

        for (FolderItem folder : folders) {
            if (folder.getName().equals(createItemDto.getName())) {
                throw new IllegalArgumentException("Folder Name already exists");
            }
        }

        FolderItem newFolder = FolderItem
                .builder()
                .name(createItemDto.getName())
                .files(new ArrayList<>())
                .folders(new ArrayList<>())
                .path(createItemDto.getParentPath() + "\\" + createItemDto.getName())
                .build();

        folders.add(newFolder);
        projectStructureRepo.save(projectStructure);
        return newFolder;
    }

    public void deleteFolder(PathDto pathDto) throws IOException {
        List<String> path = new ArrayList<>(Arrays.asList(pathDto.getPath().split("\\\\")));
        String projectID = path.get(0);
        String folderName = path.get(path.size() - 1);
        String projectStructureID = defaultProjectStorage.getProjectStructureID(projectID);
        ProjectStructure projectStructure = defaultProjectStructureService.getProjectStructure(projectStructureID);

        path.remove(path.size() - 1);
        String parentPath = String.join("\\", path);
        List<FolderItem> folders = getParentFolders(projectStructure, parentPath);

        boolean folderFound = false;
        Iterator<FolderItem> iterator = folders.iterator();
        while (iterator.hasNext()) {
            FolderItem folder = iterator.next();
            if (folder.getName().equals(folderName)) {
                iterator.remove();
                folderFound = true;
                break;
            }
        }
        if (!folderFound) {
            throw new IllegalArgumentException("Folder not found: " + folderName);
        }
        projectStructureRepo.save(projectStructure);
    }

    private List<FolderItem> getParentFolders(ProjectStructure projectStructure, String parentPath) {
        List<String> path = Arrays.asList(parentPath.split("\\\\"));
        List<FolderItem> folders = projectStructure.getFolders();
        if (path.size() > 1) {
            for (int i = 1; i < path.size(); i++) {
                boolean isFound = false;
                for (FolderItem folder : folders) {
                    if (folder.getName().equals(path.get(i))) {
                        folders = folder.getFolders();
                        isFound = true;
                        break;
                    }
                }
                if (!isFound) {
                    throw new IllegalArgumentException("not valid path");
                }
            }
        }
        return folders;
    }
}
