package hrms.hrms.dto.request;

import jakarta.validation.constraints.NotBlank;

public class LeaveReviewRequest {

    @NotBlank(message = "Status is required (APPROVED or REJECTED).")
    private String status; // APPROVED or REJECTED

    private String rejectionReason;

    public LeaveReviewRequest() {
    }

    public LeaveReviewRequest(String status, String rejectionReason) {
        this.status = status;
        this.rejectionReason = rejectionReason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
