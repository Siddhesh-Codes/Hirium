package hrms.hrms.business.abstracts;

import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.request.EmployerRegisterRequest;
import hrms.hrms.dto.request.JobSeekerRegisterRequest;
import hrms.hrms.dto.request.LoginRequest;
import hrms.hrms.dto.response.AuthResponse;
import hrms.hrms.security.model.CustomUserDetails;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    Result registerEmployer(EmployerRegisterRequest request);

    Result registerJobSeeker(JobSeekerRegisterRequest request);

    DataResult<AuthResponse> login(LoginRequest request, HttpServletResponse response);

    DataResult<AuthResponse> refresh(String refreshToken, HttpServletResponse response);

    Result logout(String refreshToken, HttpServletResponse response);

    DataResult<AuthResponse> getCurrentUser(CustomUserDetails userDetails);
}
