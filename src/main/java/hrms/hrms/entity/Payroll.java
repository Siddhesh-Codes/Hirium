package hrms.hrms.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "payrolls", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"employee_id", "payroll_month", "payroll_year"})
})
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payroll_id")
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @NotNull
    @Column(name = "payroll_month", nullable = false)
    private Integer month; // 1 - 12

    @NotNull
    @Column(name = "payroll_year", nullable = false)
    private Integer year;

    @NotNull
    @Column(name = "basic_salary", nullable = false)
    private Double basicSalary;

    @Column(name = "allowances")
    private Double allowances = 0.0;

    @Column(name = "deductions")
    private Double deductions = 0.0;

    @NotNull
    @Column(name = "net_salary", nullable = false)
    private Double netSalary;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "PROCESSED"; // DRAFT, PROCESSED, PAID

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    public Payroll() {
    }

    public Payroll(Employee employee, Integer month, Integer year, Double basicSalary, Double allowances, Double deductions, Double netSalary, String status, LocalDate paymentDate) {
        this.employee = employee;
        this.month = month;
        this.year = year;
        this.basicSalary = basicSalary;
        this.allowances = allowances != null ? allowances : 0.0;
        this.deductions = deductions != null ? deductions : 0.0;
        this.netSalary = netSalary;
        this.status = status != null ? status : "PROCESSED";
        this.paymentDate = paymentDate;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
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
