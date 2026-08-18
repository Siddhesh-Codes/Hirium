package hrms.hrms.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hrms.hrms.business.abstracts.AuthService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.ErrorDataResult;
import hrms.hrms.core.utilities.ErrorResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.request.EmployerRegisterRequest;
import hrms.hrms.dto.request.JobSeekerRegisterRequest;
import hrms.hrms.dto.request.LoginRequest;
import hrms.hrms.dto.request.RefreshTokenRequest;
import hrms.hrms.dto.response.AuthResponse;
import hrms.hrms.security.model.CustomUserDetails;
import hrms.hrms.security.ratelimit.RateLimiterService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final RateLimiterService rateLimiterService;

    public AuthController(AuthService authService, RateLimiterService rateLimiterService) {
        this.authService = authService;
        this.rateLimiterService = rateLimiterService;
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty() || !xfHeader.contains(",")) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }

    @PostMapping("/register/employer")
    public ResponseEntity<Result> registerEmployer(
            @Valid @RequestBody EmployerRegisterRequest request,
            HttpServletRequest httpRequest
    ) {
        String clientIp = getClientIp(httpRequest);
        if (!rateLimiterService.allowRequest(clientIp)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(new ErrorResult("Too many requests. Please try again later."));
        }

        Result result = authService.registerEmployer(request);
        if (!result.getSucces()) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/register/job-seeker")
    public ResponseEntity<Result> registerJobSeeker(
            @Valid @RequestBody JobSeekerRegisterRequest request,
            HttpServletRequest httpRequest
    ) {
        String clientIp = getClientIp(httpRequest);
        if (!rateLimiterService.allowRequest(clientIp)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(new ErrorResult("Too many requests. Please try again later."));
        }

        Result result = authService.registerJobSeeker(request);
        if (!result.getSucces()) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<DataResult<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse
    ) {
        String clientIp = getClientIp(httpRequest);
        if (!rateLimiterService.allowRequest(clientIp)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(new ErrorDataResult<>("Too many requests. Please try again later."));
        }

        DataResult<AuthResponse> result = authService.login(request, httpResponse);
        if (!result.getSucces()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/refresh")
    public ResponseEntity<DataResult<AuthResponse>> refresh(
            @CookieValue(name = "refreshToken", required = false) String cookieRefreshToken,
            @RequestBody(required = false) RefreshTokenRequest requestBody,
            HttpServletResponse httpResponse
    ) {
        String tokenToUse = null;
        if (requestBody != null && requestBody.getRefreshToken() != null && !requestBody.getRefreshToken().isBlank()) {
            tokenToUse = requestBody.getRefreshToken();
        } else if (cookieRefreshToken != null && !cookieRefreshToken.isBlank()) {
            tokenToUse = cookieRefreshToken;
        }

        if (tokenToUse == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorDataResult<>("Refresh token is required."));
        }

        DataResult<AuthResponse> result = authService.refresh(tokenToUse, httpResponse);
        if (!result.getSucces()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/logout")
    public ResponseEntity<Result> logout(
            @CookieValue(name = "refreshToken", required = false) String cookieRefreshToken,
            @RequestBody(required = false) RefreshTokenRequest requestBody,
            HttpServletResponse httpResponse
    ) {
        String tokenToUse = null;
        if (requestBody != null && requestBody.getRefreshToken() != null) {
            tokenToUse = requestBody.getRefreshToken();
        } else if (cookieRefreshToken != null) {
            tokenToUse = cookieRefreshToken;
        }

        Result result = authService.logout(tokenToUse, httpResponse);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/me")
    public ResponseEntity<DataResult<AuthResponse>> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        DataResult<AuthResponse> result = authService.getCurrentUser(userDetails);
        if (!result.getSucces()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
        return ResponseEntity.ok(result);
    }
}
