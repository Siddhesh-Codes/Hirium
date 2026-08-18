package hrms.hrms.security.service;

import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import hrms.hrms.security.jwt.JwtService;

@Service
public class RefreshTokenService {

    private final JwtService jwtService;
    // Thread-safe set of invalidated (blacklisted) refresh tokens
    private final Set<String> blacklistedTokens = Collections.newSetFromMap(new ConcurrentHashMap<>());

    public RefreshTokenService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public boolean isRefreshTokenValid(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }
        if (blacklistedTokens.contains(token)) {
            return false;
        }
        return jwtService.validateToken(token) && !jwtService.isTokenExpired(token);
    }

    public void invalidateToken(String token) {
        if (token != null && !token.isBlank()) {
            blacklistedTokens.add(token);
        }
    }
}
