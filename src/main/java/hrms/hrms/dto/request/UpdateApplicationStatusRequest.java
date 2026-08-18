package hrms.hrms.dto.request;

import hrms.hrms.entity.JobApplicationStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateApplicationStatusRequest {

	@NotNull
	private Integer applicationId;

	@NotNull
	private JobApplicationStatus status;

	public UpdateApplicationStatusRequest() {
	}

	public UpdateApplicationStatusRequest(Integer applicationId, JobApplicationStatus status) {
		this.applicationId = applicationId;
		this.status = status;
	}

	public Integer getApplicationId() {
		return applicationId;
	}

	public void setApplicationId(Integer applicationId) {
		this.applicationId = applicationId;
	}

	public JobApplicationStatus getStatus() {
		return status;
	}

	public void setStatus(JobApplicationStatus status) {
		this.status = status;
	}
}
