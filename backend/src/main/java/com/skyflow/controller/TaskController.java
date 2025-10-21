package com.skyflow.controller;

import com.skyflow.dto.ApiResponse;
import com.skyflow.model.Task;
import com.skyflow.model.User;
import com.skyflow.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<ApiResponse<List<Task>>> getProjectTasks(
            @PathVariable UUID projectId
    ) {
        List<Task> tasks = taskService.getProjectTasks(projectId);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> getTask(@PathVariable UUID id) {
        try {
            Task task = taskService.getTaskById(id);
            return ResponseEntity.ok(ApiResponse.success(task));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<ApiResponse<Task>> createTask(
            @PathVariable UUID projectId,
            @RequestBody Task task,
            @AuthenticationPrincipal User user
    ) {
        task.setProjectId(projectId);
        task.setCreatedBy(user.getId());
        Task created = taskService.createTask(task);
        return ResponseEntity.ok(ApiResponse.success("Task created", created));
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<ApiResponse<Task>> updateTask(
            @PathVariable UUID id,
            @RequestBody Task task
    ) {
        try {
            Task updated = taskService.updateTask(id, task);
            return ResponseEntity.ok(ApiResponse.success("Task updated", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable UUID id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok(ApiResponse.success("Task deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
