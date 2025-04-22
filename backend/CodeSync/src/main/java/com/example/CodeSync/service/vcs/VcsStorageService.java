package com.example.CodeSync.service.vcs;

import com.example.CodeSync.enums.Paths;
import com.example.CodeSync.model.ProjectStructure;
import com.example.CodeSync.service.DefaultProjectStructureService;
import com.example.CodeSync.service.ProjectStructureService;
import com.example.CodeSync.service.snowflake.IdGenerator;
import com.example.CodeSync.utility.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VcsStorageService {

    @Autowired
    private FileUtil fileUtil;
    @Autowired
    private IdGenerator snowFlakeID;
    @Autowired
    private ProjectStructureService defaultProjectStructureService;


    public String init(String projectID) throws Exception {
        if (checkVcs(projectID)) {
            return "the VCS is already initialized";
        }
        String path = Paths.Project_Paths.getPath() + "\\" + projectID + "\\.vcs";
        fileUtil.createFolder(path);
        fileUtil.createFolder(path + "\\branches");
        fileUtil.createFile(path + "\\HEAD.txt", "");
        checkout(projectID, "main");
        return "the VCS is initialized successfully";
    }


    public boolean checkVcs(String projectID) {
        String path = Paths.Project_Paths.getPath() + "\\" + projectID + "\\.vcs";
        return fileUtil.checkExistence(path);
    }

    public boolean checkBranch(String projectID, String branchName) {
        String path = Paths.Project_Paths.getPath() + "\\" + projectID + "\\.vcs\\branches\\" + branchName;
        return fileUtil.checkExistence(path);
    }

    public String createBranch(String projectID, String branchName) throws Exception {
        if (!checkVcs(projectID)) {
            return "the VCS is not initialized";
        }
        String path = Paths.Project_Paths.getPath() + "\\" + projectID + "\\.vcs\\branches\\" + branchName;
        fileUtil.createFolder(path);
        fileUtil.createFolder(path + "\\commits");
        fileUtil.createFile(path + "\\currentCommit.txt", "");
        fileUtil.deleteFile(Paths.Project_Paths.getPath() + "\\" + projectID + "\\.vcs\\HEAD.txt");
        fileUtil.createFile(Paths.Project_Paths.getPath() + "\\" + projectID + "\\.vcs\\HEAD.txt", branchName);
        commit(projectID);
        return "the branch " + branchName + " created successfully";
    }

    public String checkout(String projectID, String branchName) throws Exception {
        if (!checkVcs(projectID)) {
            return "the VCS is not initialized";
        }
        if (checkBranch(projectID, branchName)) {
            commit(projectID);
            String path = Paths.Project_Paths.getPath() + "\\" + projectID + "\\.vcs\\branches\\" + branchName;
            String currentCommitID = fileUtil.readFileContents(path + "\\currentCommit.txt");
            fileUtil.deleteFolder(Paths.Project_Paths.getPath() + "\\" + projectID + "\\snippets");
            fileUtil.deleteFile(Paths.Project_Paths.getPath() + "\\" + projectID + "\\projectStructure.txt");
            fileUtil.copyFolder(path + "\\commits\\" + currentCommitID, Paths.Project_Paths.getPath() + "\\" + projectID);
            fileUtil.deleteFile(Paths.Project_Paths.getPath() + "\\" + projectID + "\\.vcs\\HEAD.txt");
            fileUtil.createFile(Paths.Project_Paths.getPath() + "\\" + projectID + "\\.vcs\\HEAD.txt", branchName);
        } else {
            createBranch(projectID, branchName);
        }
        return "switched to branch " + branchName;
    }

    public String commit(String projectID) throws Exception {
        if (!checkVcs(projectID)) {
            return "the VCS is not initialized";
        }
        String branchName = fileUtil.readFileContents(Paths.Project_Paths.getPath() + "\\" + projectID + "\\.vcs\\HEAD.txt");
        String projectStructureID = fileUtil.readFileContents(Paths.Project_Paths.getPath() + "\\" + projectID + "\\projectStructure.txt");
        ProjectStructure newProjectStructure = defaultProjectStructureService.createCopyProjectStructure(projectStructureID);
        String commitID = snowFlakeID.generate();
        String path = Paths.Project_Paths.getPath() + "\\" + projectID + "\\.vcs\\branches\\" + branchName + "\\commits\\" + commitID;
        fileUtil.createFolder(path);
        fileUtil.createFolder(path + "\\snippets");
        fileUtil.createFile(path + "\\projectStructure.txt", newProjectStructure.getId());
        fileUtil.copyFolder(Paths.Project_Paths.getPath() + "\\" + projectID + "\\snippets", path + "\\snippets");
        fileUtil.deleteFile(Paths.Project_Paths.getPath() + "\\" + projectID + "\\.vcs\\branches\\" + branchName + "\\currentCommit.txt");
        fileUtil.createFile(Paths.Project_Paths.getPath() + "\\" + projectID + "\\.vcs\\branches\\" + branchName + "\\currentCommit.txt", commitID);
        return "commit success with id " + commitID;
    }

    public String head(String projectID) throws Exception {
        if (!checkVcs(projectID)) {
            return "the VCS is not initialized";
        }
        String path = Paths.Project_Paths.getPath() + "\\" + projectID + "\\.vcs\\HEAD.txt";
        return fileUtil.readFileContents(path);
    }

}
