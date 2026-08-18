package hrms.hrms.dto.response;

import hrms.hrms.security.model.UserRole;

public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private UserRole role;
    private long expiresIn;
    private Integer userId;
    private String email;
    private String name;

    public AuthResponse() {
    }

    public AuthResponse(String accessToken, String refreshToken, UserRole role, long expiresIn, Integer userId, String email, String name) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.role = role;
        this.expiresIn = expiresIn;
        this.userId = userId;
        this.email = email;
        this.name = name;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String accessToken;
        private String refreshToken;
        private UserRole role;
        private long expiresIn;
        private Integer userId;
        private String email;
        private String name;

        public Builder accessToken(String accessToken) {
            this.accessToken = accessToken;
            return this;
        }

        public Builder refreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
            return this;
        }

        public Builder role(UserRole role) {
            this.role = role;
            return this;
        }

        public Builder expiresIn(long expiresIn) {
            this.expiresIn = expiresIn;
            return this;
        }

        public Builder userId(Integer userId) {
            this.userId = userId;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public AuthResponse build() {
            return new AuthResponse(accessToken, refreshToken, role, expiresIn, userId, email, name);
        }
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
