package com.skyflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Column(name = "raw_user_meta_data", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String rawUserMetaData;

    @Column(name = "raw_app_meta_data", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String rawAppMetaData;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "email_confirmed_at")
    private LocalDateTime emailConfirmedAt;

    @Column(name = "last_sign_in_at")
    private LocalDateTime lastSignInAt;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "picture_url")
    private String pictureUrl;

    @Column(name = "provider")
    private String provider;

    @Column(name = "google_access_token", length = 2048)
    private String googleAccessToken;

    @Column(name = "google_refresh_token", length = 512)
    private String googleRefreshToken;

    @Column(name = "google_token_expiry")
    private LocalDateTime googleTokenExpiry;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return emailConfirmedAt != null;
    }

    public enum Role {
        USER, ADMIN, TEACHER, STUDENT
    }
}
