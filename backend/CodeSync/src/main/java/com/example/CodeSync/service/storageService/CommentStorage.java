package com.example.CodeSync.service.storageService;

import com.example.CodeSync.dto.CommentDto;
import com.example.CodeSync.model.Comment;

import java.io.IOException;
import java.util.List;

public interface CommentStorage {
    Comment addComment(CommentDto commentDto);

    List<Comment> getAllComments(String projectID) throws IOException;

    void deleteComment(String commentID, String projectID, String username) throws Exception;
}
