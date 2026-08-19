package hrms.hrms.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AttendanceDto {
    private Integer id;
    private Integer employeeId;
    private String employeeName;
    private String employeeEmail;
    private String departmentName;
    private LocalDate attendanceDate;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private Double workHours;
    private String status;
    private String notes;

    public AttendanceDto() {
    }

    public AttendanceDto(Integer id, Integer employeeId, String employeeName, String employeeEmail,
                         String departmentName, LocalDate attendanceDate, LocalTime checkInTime,
                         LocalTime checkOutTime, Double workHours, String status, String notes) {
        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeeEmail = employeeEmail;
        this.departmentName = departmentName;
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
