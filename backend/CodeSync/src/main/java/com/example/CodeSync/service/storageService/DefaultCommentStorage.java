package com.example.CodeSync.service.storageService;

import com.example.CodeSync.dto.CommentDto;
import com.example.CodeSync.enums.Paths;
import com.example.CodeSync.model.Client;
import com.example.CodeSync.model.Comment;
import com.example.CodeSync.model.Project;
import com.example.CodeSync.repository.ClientRepo;
import com.example.CodeSync.repository.ProjectRepo;
import com.example.CodeSync.service.snowflake.IdGenerator;
import com.example.CodeSync.utility.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class DefaultCommentStorage implements CommentStorage {

    @Autowired
    private FileUtil fileUtil;
    @Autowired
    private ClientRepo clientRepo;
    @Autowired
    private ProjectRepo projectRepo;
    @Autowired
    private IdGenerator snowFlakeID;


    public Comment addComment(CommentDto commentDto) {
        Comment comment = Comment
                .builder()
                .date(LocalDate.now())
                .id(snowFlakeID.generate())
                .author(commentDto.getAuthor())
                .comment(commentDto.getComment())
                .projectID(commentDto.getProjectID())
                .build();
        String path = Paths.Project_Paths.getPath() + "\\" + commentDto.getProjectID() + "\\comments\\" + comment.getId();
        fileUtil.writeObjectOnFile(comment, path);
        return comment;
    }

    public List<Comment> getAllComments(String projectID) throws IOException {
        String path = Paths.Project_Paths.getPath() + "\\" + projectID + "\\comments";
        List<String> commentIDs = fileUtil.getFilesInDirectory(path);
        List<Comment> comments = new ArrayList<>();
        for (String commentID : commentIDs) {
            Comment comment = (Comment) fileUtil.readObjectFromFile(path + "\\" + commentID);
            comments.add(comment);
        }
        return comments;
    }

    public void deleteComment(String commentID, String projectID, String username) throws Exception {
        String path = Paths.Project_Paths.getPath() + "\\" + projectID + "\\comments" + "\\" + commentID;
        Project project = projectRepo.findById(projectID).get();
        Client client = clientRepo.findByUsername(username).get();
        Comment comment = (Comment) fileUtil.readObjectFromFile(path);

        if (comment.getAuthor().equals(username) || client.getClientID().equals(project.getOwnerId())) {
            fileUtil.deleteFile(path);
        } else {
            throw new IllegalArgumentException("You are not authorized to delete this comment");
        }
    }
}
