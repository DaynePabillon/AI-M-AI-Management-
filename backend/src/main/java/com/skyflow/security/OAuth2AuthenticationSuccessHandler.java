package com.skyflow.security;

import com.skyflow.model.User;
import com.skyflow.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final OAuth2AuthorizedClientService authorizedClientService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        // Extract user information from OAuth2User
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");
        
        // Get the OAuth2 access token
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                oauthToken.getAuthorizedClientRegistrationId(),
                oauthToken.getName()
        );
        
        String accessToken = client != null ? client.getAccessToken().getTokenValue() : null;
        String refreshToken = client != null && client.getRefreshToken() != null 
                ? client.getRefreshToken().getTokenValue() : null;
        LocalDateTime tokenExpiry = client != null && client.getAccessToken().getExpiresAt() != null
                ? LocalDateTime.ofInstant(client.getAccessToken().getExpiresAt(), ZoneId.systemDefault()) : null;
        
        // Find or create user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFullName(name);
                    newUser.setPictureUrl(picture);
                    newUser.setProvider("google");
                    newUser.setEmailConfirmedAt(LocalDateTime.now()); // OAuth users are pre-confirmed
                    newUser.setLastSignInAt(LocalDateTime.now());
                    newUser.setRole(User.Role.USER);
                    return newUser;
                });
        
        // Update Google tokens
        user.setGoogleAccessToken(accessToken);
        user.setGoogleRefreshToken(refreshToken);
        user.setGoogleTokenExpiry(tokenExpiry);
        user.setLastSignInAt(LocalDateTime.now());
        userRepository.save(user);
        
        // Convert User to UserDetails for JWT generation
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password("") // Password not needed for OAuth users
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
                .build();
        
        // Generate JWT token
        String token = jwtService.generateToken(userDetails);
        
        // Redirect to frontend OAuth callback with token
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/oauth/callback")
                .queryParam("token", token)
                .build().toUriString();
        
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
