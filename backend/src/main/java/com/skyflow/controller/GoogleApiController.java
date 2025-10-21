package com.skyflow.controller;

import com.skyflow.dto.ApiResponse;
import com.skyflow.model.User;
import com.skyflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/google")
@RequiredArgsConstructor
public class GoogleApiController {

    private final UserRepository userRepository;

    @GetMapping("/token")
    public ResponseEntity<ApiResponse<Map<String, String>>> getGoogleAccessToken(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("User not authenticated"));
        }

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if token exists and is not expired
        if (user.getGoogleAccessToken() == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("No Google access token found. Please sign in with Google."));
        }

        // Check if token is expired
        if (user.getGoogleTokenExpiry() != null && 
            user.getGoogleTokenExpiry().isBefore(LocalDateTime.now())) {
            // TODO: Implement token refresh logic
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Google access token expired. Please sign in again."));
        }

        Map<String, String> tokenData = new HashMap<>();
        tokenData.put("accessToken", user.getGoogleAccessToken());
        
        return ResponseEntity.ok(ApiResponse.success("Google access token retrieved", tokenData));
    }
}