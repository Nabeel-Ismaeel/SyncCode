package com.example.CodeSync.service.vcs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CheckoutCommand implements VcsCommand {

    @Autowired
    private VcsStorageService vcsStorageService;

    @Override
    public String execute(String projectID, List<String> args) throws Exception {
        if (args.isEmpty()) {
            return "branch name is required";
        }
        String branchName = args.get(0);
        return vcsStorageService.checkout(projectID, branchName);
    }
}
