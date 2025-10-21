package com.skyflow.service;

import com.skyflow.dto.AuthRequest;
import com.skyflow.dto.AuthResponse;
import com.skyflow.dto.GoogleAuthRequest;
import com.skyflow.dto.RegisterRequest;
import com.skyflow.model.User;
import com.skyflow.model.UserProfile;
import com.skyflow.repository.UserProfileRepository;
import com.skyflow.repository.UserRepository;
import com.skyflow.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .emailConfirmedAt(LocalDateTime.now()) // Auto-confirm for now
                .build();

        user = userRepository.save(user);

        UserProfile profile = UserProfile.builder()
                .userId(user.getId())
                .fullName(request.getFullName())
                .build();

        userProfileRepository.save(profile);

        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(request.getFullName())
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElse(null);

        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(profile != null ? profile.getFullName() : null)
                .avatarUrl(profile != null ? profile.getAvatarUrl() : null)
                .build();
    }

    @Transactional
    public AuthResponse authenticateWithGoogle(GoogleAuthRequest request) {
        // In production, verify the Google token with Google's API
        // For now, we'll extract email from the token (simplified)
        
        // This is a placeholder - implement proper Google token verification
        String email = extractEmailFromGoogleToken(request.getToken());
        
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createGoogleUser(email, request.getToken()));

        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElse(null);

        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(profile != null ? profile.getFullName() : null)
                .avatarUrl(profile != null ? profile.getAvatarUrl() : null)
                .build();
    }

    private String extractEmailFromGoogleToken(String token) {
        // TODO: Implement proper Google token verification
        // Use Google's token verification API
        return "user@example.com"; // Placeholder
    }

    private User createGoogleUser(String email, String token) {
        User user = User.builder()
                .email(email)
                .role(User.Role.USER)
                .emailConfirmedAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }
}
