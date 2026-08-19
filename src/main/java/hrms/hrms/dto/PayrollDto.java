package hrms.hrms.dto;

import java.time.LocalDate;

public class PayrollDto {
    private Integer id;
    private Integer employeeId;
    private String employeeName;
    private String employeeEmail;
    private String departmentName;
    private String jobTitle;
    private Integer month;
    private Integer year;
    private String periodName;
    private Double basicSalary;
    private Double allowances;
    private Double deductions;
    private Double netSalary;
    private String status;
    private LocalDate paymentDate;

    public PayrollDto() {
    }

    public PayrollDto(Integer id, Integer employeeId, String employeeName, String employeeEmail,
                      String departmentName, String jobTitle, Integer month, Integer year,
                      Double basicSalary, Double allowances, Double deductions, Double netSalary,
                      String status, LocalDate paymentDate) {
        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeeEmail = employeeEmail;
        this.departmentName = departmentName;
        this.jobTitle = jobTitle;
        this.month = month;
        this.year = year;
        this.periodName = getMonthName(month) + " " + year;
        this.basicSalary = basicSalary;
        this.allowances = allowances;
        this.deductions = deductions;
        this.netSalary = netSalary;
        this.status = status;
        this.paymentDate = paymentDate;
    }

    private String getMonthName(Integer m) {
        if (m == null) return "";
        String[] months = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};
        return (m >= 1 && m <= 12) ? months[m - 1] : String.valueOf(m);
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getEmployeeEmail() {
        return employeeEmail;
    }

    public void setEmployeeEmail(String employeeEmail) {
        this.employeeEmail = employeeEmail;
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

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
        if (month != null && year != null) {
            this.periodName = getMonthName(month) + " " + year;
        }
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
        if (month != null && year != null) {
            this.periodName = getMonthName(month) + " " + year;
        }
    }

    public String getPeriodName() {
        return periodName;
    }

    public void setPeriodName(String periodName) {
        this.periodName = periodName;
    }

    public Double getBasicSalary() {
        return basicSalary;
    }

    public void setBasicSalary(Double basicSalary) {
        this.basicSalary = basicSalary;
    }

    public Double getAllowances() {
        return allowances;
    }

    public void setAllowances(Double allowances) {
        this.allowances = allowances;
    }

    public Double getDeductions() {
        return deductions;
    }

    public void setDeductions(Double deductions) {
        this.deductions = deductions;
    }

    public Double getNetSalary() {
        return netSalary;
    }

    public void setNetSalary(Double netSalary) {
        this.netSalary = netSalary;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }
}
