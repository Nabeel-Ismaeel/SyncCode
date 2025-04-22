package com.example.CodeSync.repository;

import com.example.CodeSync.model.ProjectStructure;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProjectStructureRepo extends MongoRepository<ProjectStructure, String> {
    Optional<ProjectStructure> findById(String id);
}
