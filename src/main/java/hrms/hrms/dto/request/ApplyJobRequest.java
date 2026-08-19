package hrms.hrms.dto.request;

import jakarta.validation.constraints.NotNull;

public class ApplyJobRequest {

	@NotNull(message = "Job advertisement ID is required.")
	private Integer jobAdvertisementId;

	private Integer jobSeekerId;
	private String candidateName;
	private String candidateEmail;
	private String candidatePhone;
	private String resumeUrl;
	private String coverLetter;

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

	public String getCandidateName() {
		return candidateName;
	}

	public void setCandidateName(String candidateName) {
		this.candidateName = candidateName;
	}

	public String getCandidateEmail() {
		return candidateEmail;
	}

	public void setCandidateEmail(String candidateEmail) {
		this.candidateEmail = candidateEmail;
	}

	public String getCandidatePhone() {
		return candidatePhone;
	}

	public void setCandidatePhone(String candidatePhone) {
		this.candidatePhone = candidatePhone;
	}

	public String getResumeUrl() {
		return resumeUrl;
	}

	public void setResumeUrl(String resumeUrl) {
		this.resumeUrl = resumeUrl;
	}

	public String getCoverLetter() {
		return coverLetter;
	}

	public void setCoverLetter(String coverLetter) {
		this.coverLetter = coverLetter;
	}
}
