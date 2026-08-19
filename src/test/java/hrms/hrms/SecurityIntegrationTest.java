package hrms.hrms;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import hrms.hrms.entity.City;
import hrms.hrms.entity.Employer;
import hrms.hrms.entity.JobAdvertisement;
import hrms.hrms.entity.JobPosition;
import hrms.hrms.entity.JobSeeker;
import hrms.hrms.repository.CityDao;
import hrms.hrms.repository.EmployerDao;
import hrms.hrms.repository.JobAdvertisementDao;
import hrms.hrms.repository.JobPositionDao;
import hrms.hrms.repository.JobSeekerDao;
import hrms.hrms.security.jwt.JwtService;
import hrms.hrms.security.model.CustomUserDetails;
import hrms.hrms.security.model.UserRole;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EmployerDao employerDao;

    @Autowired
    private JobSeekerDao jobSeekerDao;

    @Autowired
    private CityDao cityDao;

    @Autowired
    private JobPositionDao jobPositionDao;

    @Autowired
    private JobAdvertisementDao jobAdvertisementDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String employerToken;
    private String jobSeekerToken;
    private Employer savedEmployer;
    private JobSeeker savedJobSeeker;
    private City savedCity;
    private JobPosition savedPosition;
    private JobAdvertisement savedAdvertisement;

    private String unique(String prefix) {
        return prefix + System.nanoTime();
    }

    @BeforeEach
    void setUp() {
        City city = new City();
        city.setCityName(unique("City-"));
        savedCity = cityDao.save(city);

        JobPosition position = new JobPosition();
        position.setTitle(unique("Pos-"));
        savedPosition = jobPositionDao.save(position);

        Employer employer = new Employer();
        long id = System.nanoTime();
        employer.setCompanyName("Company-" + id);
        employer.setCompanyWebPage("https://company" + id + ".com");
        employer.setEmail("emp" + id + "@test.com");
        employer.setPhoneNumber("5551234567");
        employer.setPassword(passwordEncoder.encode("123456"));
        savedEmployer = employerDao.save(employer);

        CustomUserDetails employerDetails = new CustomUserDetails(
                savedEmployer.getId(), savedEmployer.getEmail(), savedEmployer.getPassword(), UserRole.EMPLOYER, savedEmployer.getCompanyName()
        );
        employerToken = jwtService.generateAccessToken(employerDetails);

        JobSeeker seeker = new JobSeeker();
        seeker.setName("Seeker");
        seeker.setLastName("User");
        seeker.setNationalId(String.valueOf(System.currentTimeMillis()).substring(0, 11));
        seeker.setBirthDate(LocalDate.of(1990, 1, 1));
        seeker.setEmail("seeker" + id + "@test.com");
        seeker.setPassword(passwordEncoder.encode("123456"));
        savedJobSeeker = jobSeekerDao.save(seeker);

        CustomUserDetails seekerDetails = new CustomUserDetails(
                savedJobSeeker.getId(), savedJobSeeker.getEmail(), savedJobSeeker.getPassword(), UserRole.JOB_SEEKER, "Seeker User"
        );
        jobSeekerToken = jwtService.generateAccessToken(seekerDetails);

        JobAdvertisement ad = new JobAdvertisement();
        ad.setJobPosition(savedPosition);
        ad.setCity(savedCity);
        ad.setEmployer(savedEmployer);
        ad.setDescription("Backend Java developer with Spring Boot skills");
        ad.setOpenPositionCount(2);
        ad.setMinSalary(5000);
        ad.setMaxSalary(10000);
        ad.setReleaseDate(LocalDate.now());
        ad.setApplicationDeadline(LocalDate.now().plusMonths(2));
        ad.setActive(true);
        savedAdvertisement = jobAdvertisementDao.save(ad);
    }

    @Test
    void should_allow_public_endpoints_without_token() throws Exception {
        mockMvc.perform(get("/api/cities/getAll"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/jobPost/getAll"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/jobAdvertisements/getAll"))
                .andExpect(status().isOk());
    }

    @Test
    void should_reject_protected_post_endpoint_without_token() throws Exception {
        String json = String.format("""
        {
            "openPositionCount": 2,
            "description": "Software Developer Position",
            "minSalary": 10000,
            "maxSalary": 20000,
            "applicationDeadline": "2030-01-01",
            "jobPositionId": %d,
            "cityId": %d,
            "employerId": %d
        }
        """, savedPosition.getId(), savedCity.getId(), savedEmployer.getId());

        mockMvc.perform(post("/api/jobPost/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.succes").value(false));
    }

    @Test
    void should_allow_employer_to_add_job_advertisement() throws Exception {
        String json = String.format("""
        {
            "openPositionCount": 2,
            "description": "Software Developer Position",
            "minSalary": 10000,
            "maxSalary": 20000,
            "applicationDeadline": "2030-01-01",
            "jobPositionId": %d,
            "cityId": %d,
            "employerId": %d
        }
        """, savedPosition.getId(), savedCity.getId(), savedEmployer.getId());

        mockMvc.perform(post("/api/jobPost/add")
                        .header("Authorization", "Bearer " + employerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.succes").value(true));
    }

    @Test
    void should_forbid_job_seeker_from_adding_job_advertisement() throws Exception {
        String json = String.format("""
        {
            "openPositionCount": 2,
            "description": "Software Developer Position",
            "minSalary": 10000,
            "maxSalary": 20000,
            "applicationDeadline": "2030-01-01",
            "jobPositionId": %d,
            "cityId": %d,
            "employerId": %d
        }
        """, savedPosition.getId(), savedCity.getId(), savedEmployer.getId());

        mockMvc.perform(post("/api/jobPost/add")
                        .header("Authorization", "Bearer " + jobSeekerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.succes").value(false));
    }

    @Test
    void should_allow_job_seeker_to_apply() throws Exception {
        String json = String.format("""
        {
            "jobAdvertisementId": %d,
            "jobSeekerId": %d
        }
        """, savedAdvertisement.getId(), savedJobSeeker.getId());

        mockMvc.perform(post("/api/applications/apply")
                        .header("Authorization", "Bearer " + jobSeekerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.succes").value(true));
    }

    @Test
    void should_allow_public_candidate_to_apply() throws Exception {
        String json = String.format("""
        {
            "jobAdvertisementId": %d,
            "candidateName": "Public Candidate",
            "candidateEmail": "public.cand%d@test.com"
        }
        """, savedAdvertisement.getId(), System.nanoTime());

        mockMvc.perform(post("/api/applications/apply")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.succes").value(true));
    }

    @Test
    void should_forbid_unauthorized_user_from_updating_application_status() throws Exception {
        String json = """
        {
            "applicationId": 999,
            "status": "APPROVED"
        }
        """;

        // Without auth header, should fail
        mockMvc.perform(post("/api/applications/update-status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isUnauthorized());
    }
}
