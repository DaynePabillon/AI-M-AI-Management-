package com.skyflow.service;

import com.skyflow.model.Project;
import com.skyflow.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
    
    public List<Project> getUserProjects(UUID userId) {
        return projectRepository.findByOwnerId(userId);
    }

    public Project getProjectById(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @Transactional
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    @Transactional
    public Project updateProject(UUID projectId, Project projectDetails) {
        Project project = getProjectById(projectId);
        
        if (projectDetails.getName() != null) {
            project.setName(projectDetails.getName());
        }
        if (projectDetails.getDescription() != null) {
            project.setDescription(projectDetails.getDescription());
        }
        if (projectDetails.getStatus() != null) {
            project.setStatus(projectDetails.getStatus());
        }
        if (projectDetails.getPriority() != null) {
            project.setPriority(projectDetails.getPriority());
        }
        if (projectDetails.getProgress() != null) {
            project.setProgress(projectDetails.getProgress());
        }
        if (projectDetails.getStartDate() != null) {
            project.setStartDate(projectDetails.getStartDate());
        }
        if (projectDetails.getEndDate() != null) {
            project.setEndDate(projectDetails.getEndDate());
        }

        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(UUID projectId) {
        projectRepository.deleteById(projectId);
    }
}
