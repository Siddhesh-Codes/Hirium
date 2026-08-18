package hrms.hrms.security.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import hrms.hrms.entity.Employer;
import hrms.hrms.entity.JobSeeker;
import hrms.hrms.repository.EmployerDao;
import hrms.hrms.repository.JobSeekerDao;
import hrms.hrms.security.model.CustomUserDetails;
import hrms.hrms.security.model.UserRole;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final EmployerDao employerDao;
    private final JobSeekerDao jobSeekerDao;

    public CustomUserDetailsService(EmployerDao employerDao, JobSeekerDao jobSeekerDao) {
        this.employerDao = employerDao;
        this.jobSeekerDao = jobSeekerDao;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Employer> employer = employerDao.findByEmail(email);
        if (employer.isPresent()) {
            Employer e = employer.get();
            return new CustomUserDetails(e.getId(), e.getEmail(), e.getPassword(), UserRole.EMPLOYER, e.getCompanyName());
        }

        Optional<JobSeeker> jobSeeker = jobSeekerDao.findByEmail(email);
        if (jobSeeker.isPresent()) {
            JobSeeker j = jobSeeker.get();
            return new CustomUserDetails(j.getId(), j.getEmail(), j.getPassword(), UserRole.JOB_SEEKER, j.getName() + " " + j.getLastName());
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
