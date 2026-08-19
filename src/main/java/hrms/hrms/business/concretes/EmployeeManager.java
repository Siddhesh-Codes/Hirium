package hrms.hrms.business.concretes;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import hrms.hrms.business.abstracts.EmployeeService;
import hrms.hrms.core.services.EmailService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.ErrorDataResult;
import hrms.hrms.core.utilities.ErrorResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.core.utilities.SuccessDataResult;
import hrms.hrms.core.utilities.SuccessResult;
import hrms.hrms.dto.EmployeeDto;
import hrms.hrms.dto.request.EmployeeRequest;
import hrms.hrms.entity.Department;
import hrms.hrms.entity.Employee;
import hrms.hrms.repository.DepartmentDao;
import hrms.hrms.repository.EmployeeDao;

@Service
public class EmployeeManager implements EmployeeService {

    private final EmployeeDao employeeDao;
    private final DepartmentDao departmentDao;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public EmployeeManager(
            EmployeeDao employeeDao,
            DepartmentDao departmentDao,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {
        this.employeeDao = employeeDao;
        this.departmentDao = departmentDao;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    private EmployeeDto toDto(Employee e) {
        String deptName = e.getDepartment() != null ? e.getDepartment().getName() : "Unassigned";
        Integer deptId = e.getDepartment() != null ? e.getDepartment().getId() : null;
        return new EmployeeDto(
                e.getId(),
                e.getFirstName(),
                e.getLastName(),
                e.getEmail(),
                e.getPhone(),
                deptId,
                deptName,
                e.getJobTitle(),
                e.getRole(),
                e.getStatus(),
                e.getHireDate(),
                e.getSalary(),
                e.getPasswordChangeRequired()
        );
    }

    @Override
    public DataResult<List<EmployeeDto>> getAll() {
        List<EmployeeDto> list = employeeDao.findAll().stream().map(this::toDto).toList();
        return new SuccessDataResult<>(list, "Employees listed successfully.");
    }

    @Override
    public DataResult<EmployeeDto> getById(Integer id) {
        Optional<Employee> opt = employeeDao.findById(id);
        if (opt.isEmpty()) {
            return new ErrorDataResult<>("Employee not found with ID: " + id);
        }
        return new SuccessDataResult<>(toDto(opt.get()), "Employee retrieved.");
    }

    @Override
    public DataResult<EmployeeDto> getByEmail(String email) {
        Optional<Employee> opt = employeeDao.findByEmail(email);
        if (opt.isEmpty()) {
            return new ErrorDataResult<>("Employee not found with email: " + email);
        }
        return new SuccessDataResult<>(toDto(opt.get()), "Employee retrieved.");
    }

    @Override
    public DataResult<List<EmployeeDto>> getByDepartment(Integer departmentId) {
        List<EmployeeDto> list = employeeDao.findByDepartmentId(departmentId).stream().map(this::toDto).toList();
        return new SuccessDataResult<>(list, "Department employees listed.");
    }

    @Override
    public Result add(EmployeeRequest request) {
        if (employeeDao.findByEmail(request.getEmail()).isPresent()) {
            return new ErrorResult("Email is already in use by another employee.");
        }

        Department department = null;
        String deptName = "Hirium";
        if (request.getDepartmentId() != null) {
            Optional<Department> deptOpt = departmentDao.findById(request.getDepartmentId());
            if (deptOpt.isPresent()) {
                department = deptOpt.get();
                deptName = department.getName();
            }
        }

        String rawPassword = request.getPassword() != null && !request.getPassword().isBlank()
                ? request.getPassword()
                : "Hirium@" + (int)(Math.random() * 9000 + 1000) + "!"; // Generates realistic initial password

        Employee employee = new Employee();
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPassword(passwordEncoder.encode(rawPassword));
        employee.setPhone(request.getPhone());
        employee.setDepartment(department);
        employee.setJobTitle(request.getJobTitle());
        employee.setRole(request.getRole());
        employee.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        employee.setHireDate(request.getHireDate() != null ? request.getHireDate() : LocalDate.now());
        employee.setSalary(request.getSalary() != null ? request.getSalary() : 50000.0);
        employee.setPasswordChangeRequired(true); // Mandatory password change on first login

        employeeDao.save(employee);

        // Fire automated onboarding email
        emailService.sendWelcomeEmail(
                employee.getEmail(),
                employee.getFirstName() + " " + employee.getLastName(),
                deptName,
                rawPassword
        );

        return new SuccessResult("Employee added successfully. Welcome credentials have been dispatched.");
    }

    @Override
    public Result update(Integer id, EmployeeRequest request) {
        Optional<Employee> opt = employeeDao.findById(id);
        if (opt.isEmpty()) {
            return new ErrorResult("Employee not found with ID: " + id);
        }

        Employee employee = opt.get();
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setPhone(request.getPhone());

        if (request.getDepartmentId() != null) {
            departmentDao.findById(request.getDepartmentId()).ifPresent(employee::setDepartment);
        } else {
            employee.setDepartment(null);
        }

        employee.setJobTitle(request.getJobTitle());
        if (request.getRole() != null) {
            employee.setRole(request.getRole());
        }
        if (request.getStatus() != null) {
            employee.setStatus(request.getStatus());
        }
        if (request.getHireDate() != null) {
            employee.setHireDate(request.getHireDate());
        }
        if (request.getSalary() != null) {
            employee.setSalary(request.getSalary());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            employee.setPassword(passwordEncoder.encode(request.getPassword()));
            employee.setPasswordChangeRequired(false);
        }

        employeeDao.save(employee);
        return new SuccessResult("Employee updated successfully.");
    }

    @Override
    public Result delete(Integer id) {
        if (!employeeDao.existsById(id)) {
            return new ErrorResult("Employee not found with ID: " + id);
        }
        employeeDao.deleteById(id);
        return new SuccessResult("Employee deleted successfully.");
    }

    @Override
    public Result changePassword(Integer id, String oldPassword, String newPassword) {
        Optional<Employee> opt = employeeDao.findById(id);
        if (opt.isEmpty()) {
            return new ErrorResult("Employee not found with ID: " + id);
        }

        Employee employee = opt.get();

        // If old password is provided and not empty, verify
        if (oldPassword != null && !oldPassword.isBlank()) {
            if (!passwordEncoder.matches(oldPassword, employee.getPassword())) {
                return new ErrorResult("Current password does not match.");
            }
        }

        if (newPassword == null || newPassword.length() < 6) {
            return new ErrorResult("New password must be at least 6 characters long.");
        }

        employee.setPassword(passwordEncoder.encode(newPassword));
        employee.setPasswordChangeRequired(false); // Flag cleared
        employeeDao.save(employee);

        return new SuccessResult("Password updated successfully.");
    }
}
