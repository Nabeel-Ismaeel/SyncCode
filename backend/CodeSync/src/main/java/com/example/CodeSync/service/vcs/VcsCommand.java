package com.example.CodeSync.service.vcs;

import java.util.List;

public interface VcsCommand {
    String execute(String projectID, List<String> args) throws Exception;
}
