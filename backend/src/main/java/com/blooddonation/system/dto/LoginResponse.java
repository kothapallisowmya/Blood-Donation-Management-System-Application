package com.blooddonation.system.dto;

import com.blooddonation.system.enums.Role;

public class LoginResponse {
    private String token;
    private Role role;
    private String email;
    private Long userId;

    public LoginResponse() {
    }

    public LoginResponse(String token, Role role, String email, Long userId) {
        this.token = token;
        this.role = role;
        this.email = email;
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private Role role;
        private String email;
        private Long userId;

        public Builder token(String token) {
            this.token = token;
            return this;
        }

        public Builder role(Role role) {
            this.role = role;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public LoginResponse build() {
            return new LoginResponse(token, role, email, userId);
        }
    }
}
