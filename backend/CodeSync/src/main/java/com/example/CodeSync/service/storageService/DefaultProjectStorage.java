package com.example.CodeSync.service.storageService;

import com.example.CodeSync.enums.Paths;
import com.example.CodeSync.model.ProjectStructure;
import com.example.CodeSync.service.ProjectStructureService;
import com.example.CodeSync.utility.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Service
public class DefaultProjectStorage implements ProjectStorage {

    @Autowired
    private FileUtil fileUtil;
    @Autowired
    private ProjectStructureService defaultProjectStructureService;

    @Transactional
    public void creteProject(String projectID) throws Exception {
        fileUtil.createFolder(Paths.Project_Paths.getPath() + "\\" + projectID);
        fileUtil.createFolder(Paths.Project_Paths.getPath() + "\\" + projectID + "\\snippets");
        fileUtil.createFolder(Paths.Project_Paths.getPath() + "\\" + projectID + "\\comments");

        ProjectStructure projectStructure = defaultProjectStructureService.createProjectStructure(projectID);
        fileUtil.createFile(Paths.Project_Paths.getPath() + "\\" + projectID + "\\projectStructure.txt", projectStructure.getId());
    }

    @Transactional
    public void deleteProject(String projectID) throws Exception {
        String projectStructureID = fileUtil.readFileContents(Paths.Project_Paths.getPath() + "\\" + projectID + "\\projectStructure.txt");
        defaultProjectStructureService.deleteProjectStructure(projectStructureID);
        fileUtil.deleteFolder(Paths.Project_Paths.getPath() + "\\" + projectID);
    }

    public String getProjectStructureID(String projectID) throws IOException {
        String projectStructureID = fileUtil.readFileContents(Paths.Project_Paths.getPath() + "\\" + projectID + "\\projectStructure.txt");
        return projectStructureID;
    }
}
