package com.example.CodeSync.controller;

import com.example.CodeSync.dto.CommentDto;
import com.example.CodeSync.model.Comment;
import com.example.CodeSync.service.security.JwtService;
import com.example.CodeSync.service.storageService.CommentStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private JwtService jwtService;
    @Autowired
    private CommentStorage defaultCommentStorage;

    @PostMapping("/addComment")
    public Comment addComment(@RequestBody CommentDto commentDto, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtService.extractUserName(token);
        commentDto.setAuthor(username);
        return defaultCommentStorage.addComment(commentDto);
    }

    @GetMapping("/allComments/{projectID}")
    public List<Comment> getAllComments(@PathVariable String projectID) throws IOException {
        return defaultCommentStorage.getAllComments(projectID);
    }

    @GetMapping("/deleteComment/{projectID}/{commentID}")
    public void deleteComment(@PathVariable String projectID, @PathVariable String commentID, @RequestHeader("Authorization") String authHeader) throws Exception {
        String token = authHeader.substring(7);
        String username = jwtService.extractUserName(token);
        defaultCommentStorage.deleteComment(commentID, projectID, username);
    }
}
