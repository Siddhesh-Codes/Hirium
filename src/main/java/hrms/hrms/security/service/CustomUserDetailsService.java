package hrms.hrms.security.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import hrms.hrms.entity.Employee;
import hrms.hrms.entity.Employer;
import hrms.hrms.entity.JobSeeker;
import hrms.hrms.repository.EmployeeDao;
import hrms.hrms.repository.EmployerDao;
import hrms.hrms.repository.JobSeekerDao;
import hrms.hrms.security.model.CustomUserDetails;
import hrms.hrms.security.model.UserRole;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final EmployeeDao employeeDao;
    private final EmployerDao employerDao;
    private final JobSeekerDao jobSeekerDao;

    public CustomUserDetailsService(EmployeeDao employeeDao, EmployerDao employerDao, JobSeekerDao jobSeekerDao) {
        this.employeeDao = employeeDao;
        this.employerDao = employerDao;
        this.jobSeekerDao = jobSeekerDao;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Check Employee (ADMIN, HR, EMPLOYEE)
        Optional<Employee> employeeOpt = employeeDao.findByEmail(email);
        if (employeeOpt.isPresent()) {
            Employee emp = employeeOpt.get();
            return new CustomUserDetails(
                    emp.getId(),
                    emp.getEmail(),
                    emp.getPassword(),
                    emp.getRole(),
                    emp.getFirstName() + " " + emp.getLastName(),
                    emp.getPasswordChangeRequired()
            );
        }

        // 2. Check Employer
        Optional<Employer> employer = employerDao.findByEmail(email);
        if (employer.isPresent()) {
            Employer e = employer.get();
            return new CustomUserDetails(e.getId(), e.getEmail(), e.getPassword(), UserRole.EMPLOYER, e.getCompanyName());
        }

        // 3. Check Job Seeker
        Optional<JobSeeker> jobSeeker = jobSeekerDao.findByEmail(email);
        if (jobSeeker.isPresent()) {
            JobSeeker j = jobSeeker.get();
            return new CustomUserDetails(j.getId(), j.getEmail(), j.getPassword(), UserRole.JOB_SEEKER, j.getName() + " " + j.getLastName());
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
