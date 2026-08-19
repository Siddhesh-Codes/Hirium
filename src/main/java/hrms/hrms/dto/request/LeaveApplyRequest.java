package hrms.hrms.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class LeaveApplyRequest {

    @NotNull(message = "Employee ID is required.")
    private Integer employeeId;

    @NotBlank(message = "Leave type is required.")
    private String leaveType; // CASUAL, SICK, ANNUAL, MATERNITY, UNPAID

    @NotNull(message = "Start date is required.")
    private LocalDate startDate;

    @NotNull(message = "End date is required.")
    private LocalDate endDate;

    @NotBlank(message = "Reason is required.")
    @Size(min = 5, max = 500, message = "Reason must be between 5 and 500 characters.")
    private String reason;

    public LeaveApplyRequest() {
    }

    public LeaveApplyRequest(Integer employeeId, String leaveType, LocalDate startDate, LocalDate endDate, String reason) {
        this.employeeId = employeeId;
        this.leaveType = leaveType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reason = reason;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public String getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
