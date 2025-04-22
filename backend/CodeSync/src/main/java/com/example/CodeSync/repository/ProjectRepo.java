package com.example.CodeSync.repository;

import com.example.CodeSync.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProjectRepo extends MongoRepository<Project, String> {
    Optional<Project> findById(String id);
}
