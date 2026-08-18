package hrms.hrms.dto.request;

import jakarta.validation.constraints.NotNull;

public class ApplyJobRequest {

	@NotNull
	private Integer jobAdvertisementId;

	@NotNull
	private Integer jobSeekerId;

	private String resumeUrl;

	public ApplyJobRequest() {
	}

	public ApplyJobRequest(Integer jobAdvertisementId, Integer jobSeekerId) {
		this.jobAdvertisementId = jobAdvertisementId;
		this.jobSeekerId = jobSeekerId;
	}

	public ApplyJobRequest(Integer jobAdvertisementId, Integer jobSeekerId, String resumeUrl) {
		this.jobAdvertisementId = jobAdvertisementId;
		this.jobSeekerId = jobSeekerId;
		this.resumeUrl = resumeUrl;
	}

	public Integer getJobAdvertisementId() {
		return jobAdvertisementId;
	}

	public void setJobAdvertisementId(Integer jobAdvertisementId) {
		this.jobAdvertisementId = jobAdvertisementId;
	}

	public Integer getJobSeekerId() {
		return jobSeekerId;
	}

	public void setJobSeekerId(Integer jobSeekerId) {
		this.jobSeekerId = jobSeekerId;
	}

	public String getResumeUrl() {
		return resumeUrl;
	}

	public void setResumeUrl(String resumeUrl) {
		this.resumeUrl = resumeUrl;
	}
}
