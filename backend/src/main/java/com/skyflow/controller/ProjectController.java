package com.skyflow.controller;

import com.skyflow.dto.ApiResponse;
import com.skyflow.model.Project;
import com.skyflow.model.User;
import com.skyflow.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Project>>> getUserProjects(
            @AuthenticationPrincipal User user
    ) {
        // If no user authenticated, return all projects (for testing)
        if (user == null) {
            List<Project> projects = projectService.getAllProjects();
            return ResponseEntity.ok(ApiResponse.success(projects));
        }
        List<Project> projects = projectService.getUserProjects(user.getId());
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> getProject(@PathVariable UUID id) {
        try {
            Project project = projectService.getProjectById(id);
            return ResponseEntity.ok(ApiResponse.success(project));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Project>> createProject(
            @RequestBody Project project,
            @AuthenticationPrincipal User user
    ) {
        project.setOwnerId(user.getId());
        Project created = projectService.createProject(project);
        return ResponseEntity.ok(ApiResponse.success("Project created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> updateProject(
            @PathVariable UUID id,
            @RequestBody Project project
    ) {
        try {
            Project updated = projectService.updateProject(id, project);
            return ResponseEntity.ok(ApiResponse.success("Project updated", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable UUID id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.ok(ApiResponse.success("Project deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
