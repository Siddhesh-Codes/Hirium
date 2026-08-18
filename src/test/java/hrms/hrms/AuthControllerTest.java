package hrms.hrms;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import hrms.hrms.entity.Employer;
import hrms.hrms.entity.JobSeeker;
import hrms.hrms.repository.EmployerDao;
import hrms.hrms.repository.JobSeekerDao;
import hrms.hrms.security.jwt.JwtService;
import hrms.hrms.security.model.CustomUserDetails;
import hrms.hrms.security.model.UserRole;
import jakarta.servlet.http.Cookie;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EmployerDao employerDao;

    @Autowired
    private JobSeekerDao jobSeekerDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private String unique(String prefix) {
        return prefix + System.nanoTime();
    }

    private String uniqueNationalId() {
        return String.format("%011d", Math.abs(System.nanoTime() % 100000000000L));
    }

    @Test
    void should_register_employer() throws Exception {
        String email = unique("employer") + "@test.com";
        String json = String.format("""
        {
            "companyName": "Acme Corp",
            "companyWebPage": "https://acme.com",
            "email": "%s",
            "phoneNumber": "5551234567",
            "password": "password123",
            "confirmPassword": "password123"
        }
        """, email);

        mockMvc.perform(post("/api/auth/register/employer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.succes").value(true));
    }

    @Test
    void should_register_job_seeker() throws Exception {
        String email = unique("seeker") + "@test.com";
        String nationalId = uniqueNationalId();
        String json = String.format("""
        {
            "name": "Jane",
            "lastName": "Doe",
            "nationalId": "%s",
            "birthDate": "1995-05-15",
            "email": "%s",
            "password": "password123",
            "confirmPassword": "password123"
        }
        """, nationalId, email);

        mockMvc.perform(post("/api/auth/register/job-seeker")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.succes").value(true));
    }

    @Test
    void should_login_employer_successfully() throws Exception {
        String email = unique("employer") + "@test.com";
        Employer employer = new Employer();
        employer.setCompanyName("Tech Company");
        employer.setCompanyWebPage("https://tech.com");
        employer.setEmail(email);
        employer.setPhoneNumber("5559876543");
        employer.setPassword(passwordEncoder.encode("secretPassword"));
        employerDao.save(employer);

        String json = String.format("""
        {
            "email": "%s",
            "password": "secretPassword"
        }
        """, email);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.succes").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.role").value("EMPLOYER"))
                .andExpect(cookie().exists("refreshToken"));
    }

    @Test
    void should_fail_login_with_wrong_password() throws Exception {
        String email = unique("employer") + "@test.com";
        Employer employer = new Employer();
        employer.setCompanyName("Tech Company");
        employer.setCompanyWebPage("https://tech.com");
        employer.setEmail(email);
        employer.setPhoneNumber("5559876543");
        employer.setPassword(passwordEncoder.encode("secretPassword"));
        employerDao.save(employer);

        String json = String.format("""
        {
            "email": "%s",
            "password": "wrongPassword"
        }
        """, email);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.succes").value(false));
    }

    @Test
    void should_refresh_token_successfully() throws Exception {
        String email = unique("seeker") + "@test.com";
        JobSeeker seeker = new JobSeeker();
        seeker.setName("John");
        seeker.setLastName("Doe");
        seeker.setNationalId(uniqueNationalId());
        seeker.setBirthDate(java.time.LocalDate.of(1992, 1, 1));
        seeker.setEmail(email);
        seeker.setPassword(passwordEncoder.encode("password123"));
        seeker = jobSeekerDao.save(seeker);

        CustomUserDetails userDetails = new CustomUserDetails(seeker.getId(), email, seeker.getPassword(), UserRole.JOB_SEEKER, "John Doe");
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        mockMvc.perform(post("/api/auth/refresh")
                        .cookie(new Cookie("refreshToken", refreshToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.succes").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.role").value("JOB_SEEKER"))
                .andExpect(cookie().exists("refreshToken"));
    }

    @Test
    void should_logout_successfully() throws Exception {
        mockMvc.perform(post("/api/auth/logout")
                        .cookie(new Cookie("refreshToken", "dummyToken")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.succes").value(true))
                .andExpect(cookie().maxAge("refreshToken", 0));
    }

    @Test
    void should_get_current_user_profile() throws Exception {
        String email = unique("employer") + "@test.com";
        Employer employer = new Employer();
        employer.setCompanyName("Acme Inc");
        employer.setCompanyWebPage("https://acme.org");
        employer.setEmail(email);
        employer.setPhoneNumber("5551112233");
        employer.setPassword(passwordEncoder.encode("pass123"));
        employer = employerDao.save(employer);

        CustomUserDetails userDetails = new CustomUserDetails(employer.getId(), email, employer.getPassword(), UserRole.EMPLOYER, "Acme Inc");
        String token = jwtService.generateAccessToken(userDetails);

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.succes").value(true))
                .andExpect(jsonPath("$.data.email").value(email))
                .andExpect(jsonPath("$.data.role").value("EMPLOYER"));
    }
}
