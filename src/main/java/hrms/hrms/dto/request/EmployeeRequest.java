package hrms.hrms.dto.request;

import java.time.LocalDate;

import hrms.hrms.security.model.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class EmployeeRequest {

    @NotBlank(message = "First name is required.")
    @Size(min = 2, max = 100)
    private String firstName;

    @NotBlank(message = "Last name is required.")
    @Size(min = 2, max = 100)
    private String lastName;

    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid email format.")
    private String email;

    @Size(min = 6, max = 100, message = "Password must be at least 6 characters.")
    private String password;

    private String phone;
    private Integer departmentId;
    private String jobTitle;

    @NotNull(message = "Role is required.")
    private UserRole role = UserRole.EMPLOYEE;

    private String status = "ACTIVE";
    private LocalDate hireDate;
    private Double salary;

    public EmployeeRequest() {
    }

    public EmployeeRequest(String firstName, String lastName, String email, String password, String phone,
                           Integer departmentId, String jobTitle, UserRole role, String status, LocalDate hireDate, Double salary) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.departmentId = departmentId;
        this.jobTitle = jobTitle;
        this.role = role;
        this.status = status;
        this.hireDate = hireDate;
        this.salary = salary;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Integer departmentId) {
        this.departmentId = departmentId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getHireDate() {
        return hireDate;
    }

    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }
}
