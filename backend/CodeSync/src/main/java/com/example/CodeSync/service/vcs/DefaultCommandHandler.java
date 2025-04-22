package com.example.CodeSync.service.vcs;

import com.example.CodeSync.dto.CommandDto;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DefaultCommandHandler implements CommandHandler {

    @Autowired
    private ApplicationContext applicationContext;
    private Map<String, VcsCommand> commands = new HashMap<>();

    @PostConstruct
    public void init() {
        commands.put("head", applicationContext.getBean(HeadCommand.class));
        commands.put("init", applicationContext.getBean(InitVcsCommand.class));
        commands.put("commit", applicationContext.getBean(CommitCommand.class));
        commands.put("checkout", applicationContext.getBean(CheckoutCommand.class));
    }

    @Override
    public String execute(CommandDto commandDto) throws Exception {
        String command = commandDto.getCommand();
        if (!command.startsWith("vcs")) {
            return "is not a vcs command";
        }

        List<String> commandList = new ArrayList<>(Arrays.asList(command.split(" ")));
        if (commandList.size() < 2) {
            return "no such command";
        }

        VcsCommand vcsCommand = commands.get(commandList.get(1));
        if (vcsCommand == null) {
            return "vcs command not found";
        }

        commandList.remove(0);
        commandList.remove(0);
        return vcsCommand.execute(commandDto.getProjectID(), commandList);
    }
}
