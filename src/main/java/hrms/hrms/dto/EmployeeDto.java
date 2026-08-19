package hrms.hrms.dto;

import java.time.LocalDate;

import hrms.hrms.security.model.UserRole;

public class EmployeeDto {
    private Integer id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private Integer departmentId;
    private String departmentName;
    private String jobTitle;
    private UserRole role;
    private String status;
    private LocalDate hireDate;
    private Double salary;
    private Boolean passwordChangeRequired;

    public EmployeeDto() {
    }

    public EmployeeDto(Integer id, String firstName, String lastName, String email, String phone,
                       Integer departmentId, String departmentName, String jobTitle, UserRole role,
                       String status, LocalDate hireDate, Double salary, Boolean passwordChangeRequired) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = firstName + " " + lastName;
        this.email = email;
        this.phone = phone;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.jobTitle = jobTitle;
        this.role = role;
        this.status = status;
        this.hireDate = hireDate;
        this.salary = salary;
        this.passwordChangeRequired = passwordChangeRequired;
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

    public String getFullName() {
        return fullName != null ? fullName : firstName + " " + lastName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
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
