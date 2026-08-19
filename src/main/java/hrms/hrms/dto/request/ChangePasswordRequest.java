package hrms.hrms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ChangePasswordRequest {

    @NotNull(message = "Employee ID is required.")
    private Integer employeeId;

    private String oldPassword;

    @NotBlank(message = "New password is required.")
    @Size(min = 6, message = "New password must be at least 6 characters.")
    private String newPassword;

    public ChangePasswordRequest() {
    }

    public ChangePasswordRequest(Integer employeeId, String oldPassword, String newPassword) {
        this.employeeId = employeeId;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
