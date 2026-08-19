package hrms.hrms.business.concretes;

import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import hrms.hrms.business.abstracts.AuthService;
import hrms.hrms.business.abstracts.EmployerService;
import hrms.hrms.business.abstracts.JobSeekerService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.ErrorDataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.core.utilities.SuccessDataResult;
import hrms.hrms.core.utilities.SuccessResult;
import hrms.hrms.dto.request.EmployerRegisterRequest;
import hrms.hrms.dto.request.JobSeekerRegisterRequest;
import hrms.hrms.dto.request.LoginRequest;
import hrms.hrms.dto.response.AuthResponse;
import hrms.hrms.entity.Employee;
import hrms.hrms.entity.Employer;
import hrms.hrms.entity.JobSeeker;
import hrms.hrms.repository.EmployeeDao;
import hrms.hrms.repository.EmployerDao;
import hrms.hrms.repository.JobSeekerDao;
import hrms.hrms.security.jwt.JwtService;
import hrms.hrms.security.model.CustomUserDetails;
import hrms.hrms.security.model.UserRole;
import hrms.hrms.security.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthManager implements AuthService {

    private final EmployerService employerService;
    private final JobSeekerService jobSeekerService;
    private final EmployeeDao employeeDao;
    private final EmployerDao employerDao;
    private final JobSeekerDao jobSeekerDao;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthManager(
            EmployerService employerService,
            JobSeekerService jobSeekerService,
            EmployeeDao employeeDao,
            EmployerDao employerDao,
            JobSeekerDao jobSeekerDao,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            RefreshTokenService refreshTokenService
    ) {
        this.employerService = employerService;
        this.jobSeekerService = jobSeekerService;
        this.employeeDao = employeeDao;
        this.employerDao = employerDao;
        this.jobSeekerDao = jobSeekerDao;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    public Result registerEmployer(EmployerRegisterRequest request) {
        return employerService.register(request);
    }

    @Override
    public Result registerJobSeeker(JobSeekerRegisterRequest request) {
        return jobSeekerService.register(request);
    }

    @Override
    public DataResult<AuthResponse> login(LoginRequest request, HttpServletResponse response) {
        // 1. Check Organization Employee (ADMIN, HR, EMPLOYEE)
        Optional<Employee> empOpt = employeeDao.findByEmail(request.getEmail());
        if (empOpt.isPresent()) {
            Employee emp = empOpt.get();
            if (!passwordEncoder.matches(request.getPassword(), emp.getPassword())) {
                return new ErrorDataResult<>("Invalid email or password.");
            }

            CustomUserDetails userDetails = new CustomUserDetails(
                    emp.getId(),
                    emp.getEmail(),
                    emp.getPassword(),
                    emp.getRole(),
                    emp.getFirstName() + " " + emp.getLastName(),
                    emp.getPasswordChangeRequired()
            );

            return issueAuthResponse(userDetails, response, "Login successful.");
        }

        // 2. Check Employer
        Optional<Employer> employerOpt = employerDao.findByEmail(request.getEmail());
        if (employerOpt.isPresent()) {
            Employer employer = employerOpt.get();
            if (!passwordEncoder.matches(request.getPassword(), employer.getPassword())) {
                return new ErrorDataResult<>("Invalid email or password.");
            }

            CustomUserDetails userDetails = new CustomUserDetails(
                    employer.getId(),
                    employer.getEmail(),
                    employer.getPassword(),
                    UserRole.EMPLOYER,
                    employer.getCompanyName(),
                    false
            );

            return issueAuthResponse(userDetails, response, "Login successful.");
        }

        // 3. Check Job Seeker
        Optional<JobSeeker> seekerOpt = jobSeekerDao.findByEmail(request.getEmail());
        if (seekerOpt.isPresent()) {
            JobSeeker seeker = seekerOpt.get();
            if (!passwordEncoder.matches(request.getPassword(), seeker.getPassword())) {
                return new ErrorDataResult<>("Invalid email or password.");
            }

            CustomUserDetails userDetails = new CustomUserDetails(
                    seeker.getId(),
                    seeker.getEmail(),
                    seeker.getPassword(),
                    UserRole.JOB_SEEKER,
                    seeker.getName() + " " + seeker.getLastName(),
                    false
            );

            return issueAuthResponse(userDetails, response, "Login successful.");
        }

        return new ErrorDataResult<>("Invalid email or password.");
    }

    @Override
    public DataResult<AuthResponse> refresh(String refreshToken, HttpServletResponse response) {
        if (!refreshTokenService.isRefreshTokenValid(refreshToken)) {
            return new ErrorDataResult<>("Invalid or expired refresh token.");
        }

        String email = jwtService.extractEmail(refreshToken);
        UserRole role = jwtService.extractRole(refreshToken);

        CustomUserDetails userDetails = null;

        if (role == UserRole.ADMIN || role == UserRole.HR || role == UserRole.EMPLOYEE) {
            Optional<Employee> empOpt = employeeDao.findByEmail(email);
            if (empOpt.isPresent()) {
                Employee emp = empOpt.get();
                userDetails = new CustomUserDetails(
                        emp.getId(),
                        emp.getEmail(),
                        emp.getPassword(),
                        emp.getRole(),
                        emp.getFirstName() + " " + emp.getLastName(),
                        emp.getPasswordChangeRequired()
                );
            }
        } else if (role == UserRole.EMPLOYER) {
            Optional<Employer> employerOpt = employerDao.findByEmail(email);
            if (employerOpt.isPresent()) {
                Employer e = employerOpt.get();
                userDetails = new CustomUserDetails(e.getId(), e.getEmail(), e.getPassword(), UserRole.EMPLOYER, e.getCompanyName(), false);
            }
        } else if (role == UserRole.JOB_SEEKER) {
            Optional<JobSeeker> seekerOpt = jobSeekerDao.findByEmail(email);
            if (seekerOpt.isPresent()) {
                JobSeeker j = seekerOpt.get();
                userDetails = new CustomUserDetails(j.getId(), j.getEmail(), j.getPassword(), UserRole.JOB_SEEKER, j.getName() + " " + j.getLastName(), false);
            }
        }

        if (userDetails == null) {
            return new ErrorDataResult<>("User associated with token no longer exists.");
        }

        // Invalidate old refresh token for rotation
        refreshTokenService.invalidateToken(refreshToken);

        return issueAuthResponse(userDetails, response, "Token refreshed successfully.");
    }

    @Override
    public Result logout(String refreshToken, HttpServletResponse response) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenService.invalidateToken(refreshToken);
        }

        if (response != null) {
            ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                    .httpOnly(true)
                    .secure(false)
                    .sameSite("Strict")
                    .path("/")
                    .maxAge(0)
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        }

        return new SuccessResult("Logged out successfully.");
    }

    @Override
    public DataResult<AuthResponse> getCurrentUser(CustomUserDetails userDetails) {
        if (userDetails == null) {
            return new ErrorDataResult<>("Not authenticated.");
        }

        AuthResponse authResponse = AuthResponse.builder()
                .userId(userDetails.getId())
                .email(userDetails.getEmail())
                .name(userDetails.getName())
                .role(userDetails.getRole())
                .passwordChangeRequired(userDetails.getPasswordChangeRequired())
                .expiresIn(jwtService.getAccessTokenExpirationMs())
                .build();

        return new SuccessDataResult<>(authResponse, "User profile retrieved.");
    }

    private DataResult<AuthResponse> issueAuthResponse(CustomUserDetails userDetails, HttpServletResponse response, String message) {
        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        if (response != null) {
            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(true)
                    .secure(false)
                    .sameSite("Strict")
                    .path("/")
                    .maxAge(jwtService.getRefreshTokenExpirationMs() / 1000)
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        }

        AuthResponse authResponse = AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .role(userDetails.getRole())
                .expiresIn(jwtService.getAccessTokenExpirationMs())
                .userId(userDetails.getId())
                .email(userDetails.getEmail())
                .name(userDetails.getName())
                .passwordChangeRequired(userDetails.getPasswordChangeRequired())
                .build();

        return new SuccessDataResult<>(authResponse, message);
    }
}
