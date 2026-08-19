package hrms.hrms.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import hrms.hrms.security.model.UserRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Integer id;

    @NotBlank(message = "First name is required.")
    @Size(min = 2, max = 100)
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @NotBlank(message = "Last name is required.")
    @Size(min = 2, max = 100)
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid email address.")
    @Column(name = "email", nullable = false, length = 180, unique = true)
    private String email;

    @NotBlank(message = "Password is required.")
    @JsonIgnore
    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Column(name = "phone", length = 30)
    private String phone;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "job_title", length = 100)
    private String jobTitle;

    @NotNull(message = "Role is required.")
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 30)
    private UserRole role;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, ON_LEAVE, TERMINATED

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @Column(name = "salary")
    private Double salary; // Monthly Basic Salary in INR (₹)

    @Column(name = "password_change_required")
    private Boolean passwordChangeRequired = false;

    public Employee() {
    }

    public Employee(String firstName, String lastName, String email, String password, String phone,
                    Department department, String jobTitle, UserRole role, String status, LocalDate hireDate, Double salary) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.department = department;
        this.jobTitle = jobTitle;
        this.role = role;
        this.status = status != null ? status : "ACTIVE";
        this.hireDate = hireDate;
        this.salary = salary;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
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

    public Boolean getPasswordChangeRequired() {
        return passwordChangeRequired;
    }

    public void setPasswordChangeRequired(Boolean passwordChangeRequired) {
        this.passwordChangeRequired = passwordChangeRequired;
    }
}
