package com.example.CodeSync.service.vcs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommitCommand implements VcsCommand {

    @Autowired
    private VcsStorageService vcsStorageService;

    @Override
    public String execute(String projectID, List<String> args) throws Exception {
        return vcsStorageService.commit(projectID);
    }
}
