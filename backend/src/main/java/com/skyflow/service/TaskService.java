package com.skyflow.service;

import com.skyflow.model.Task;
import com.skyflow.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<Task> getProjectTasks(UUID projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public Task getTaskById(UUID taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    @Transactional
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTask(UUID taskId, Task taskDetails) {
        Task task = getTaskById(taskId);

        if (taskDetails.getTitle() != null) {
            task.setTitle(taskDetails.getTitle());
        }
        if (taskDetails.getDescription() != null) {
            task.setDescription(taskDetails.getDescription());
        }
        if (taskDetails.getStatus() != null) {
            task.setStatus(taskDetails.getStatus());
            if (taskDetails.getStatus() == Task.Status.DONE) {
                task.setCompletedAt(LocalDateTime.now());
            }
        }
        if (taskDetails.getPriority() != null) {
            task.setPriority(taskDetails.getPriority());
        }
        if (taskDetails.getAssigneeId() != null) {
            task.setAssigneeId(taskDetails.getAssigneeId());
        }
        if (taskDetails.getDueDate() != null) {
            task.setDueDate(taskDetails.getDueDate());
        }

        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(UUID taskId) {
        taskRepository.deleteById(taskId);
    }

    public List<Task> getTasksByStatus(UUID projectId, Task.Status status) {
        return taskRepository.findByProjectIdAndStatus(projectId, status);
    }
}
