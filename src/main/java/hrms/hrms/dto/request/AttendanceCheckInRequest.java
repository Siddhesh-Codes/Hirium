package hrms.hrms.dto.request;

import jakarta.validation.constraints.NotNull;

public class AttendanceCheckInRequest {

    @NotNull(message = "Employee ID is required.")
    private Integer employeeId;

    private String notes;

    public AttendanceCheckInRequest() {
    }

    public AttendanceCheckInRequest(Integer employeeId, String notes) {
        this.employeeId = employeeId;
        this.notes = notes;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
