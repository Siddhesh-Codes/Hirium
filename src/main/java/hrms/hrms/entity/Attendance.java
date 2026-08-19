package hrms.hrms.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "attendances", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"employee_id", "attendance_date"})
})
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column(name = "check_in_time")
    private LocalTime checkInTime;

    @Column(name = "check_out_time")
    private LocalTime checkOutTime;

    @Column(name = "work_hours")
    private Double workHours; // Computed hours e.g. 8.5

    @Column(name = "status", nullable = false, length = 30)
    private String status = "PRESENT"; // PRESENT, LATE, HALF_DAY, ABSENT

    @Column(name = "notes", length = 255)
    private String notes;

    public Attendance() {
    }

    public Attendance(Employee employee, LocalDate attendanceDate, LocalTime checkInTime, String status) {
        this.employee = employee;
        this.attendanceDate = attendanceDate;
        this.checkInTime = checkInTime;
        this.status = status != null ? status : "PRESENT";
    }

    public Attendance(Employee employee, LocalDate attendanceDate, LocalTime checkInTime, LocalTime checkOutTime, Double workHours, String status, String notes) {
        this.employee = employee;
        this.attendanceDate = attendanceDate;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.workHours = workHours;
        this.status = status;
        this.notes = notes;
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

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public LocalTime getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(LocalTime checkInTime) {
        this.checkInTime = checkInTime;
    }

    public LocalTime getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(LocalTime checkOutTime) {
        this.checkOutTime = checkOutTime;
    }

    public Double getWorkHours() {
        return workHours;
    }

    public void setWorkHours(Double workHours) {
        this.workHours = workHours;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
