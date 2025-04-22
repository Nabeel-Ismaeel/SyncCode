package com.example.CodeSync.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class Comment implements Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String author;
    private LocalDate date;
    private String comment;
    private String projectID;
}
