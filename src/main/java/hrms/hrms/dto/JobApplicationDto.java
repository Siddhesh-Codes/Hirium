package hrms.hrms.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import hrms.hrms.entity.JobApplicationStatus;

public class JobApplicationDto {

	private Integer id;
	private Integer jobAdvertisementId;
	private Integer jobSeekerId;
	private String candidateName;
	private String candidateEmail;
	private LocalDate candidateBirthDate;
	private String jobTitle;
	private String employerName;
	private LocalDateTime applicationDate;
	private JobApplicationStatus status;
	private String resumeUrl;

	public JobApplicationDto() {
	}

	public JobApplicationDto(Integer id, Integer jobAdvertisementId, Integer jobSeekerId, String candidateName,
			String candidateEmail, LocalDate candidateBirthDate, String jobTitle, String employerName,
			LocalDateTime applicationDate, JobApplicationStatus status, String resumeUrl) {
		this.id = id;
		this.jobAdvertisementId = jobAdvertisementId;
		this.jobSeekerId = jobSeekerId;
		this.candidateName = candidateName;
		this.candidateEmail = candidateEmail;
		this.candidateBirthDate = candidateBirthDate;
		this.jobTitle = jobTitle;
		this.employerName = employerName;
		this.applicationDate = applicationDate;
		this.status = status;
		this.resumeUrl = resumeUrl;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
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

	public LocalDate getCandidateBirthDate() {
		return candidateBirthDate;
	}

	public void setCandidateBirthDate(LocalDate candidateBirthDate) {
		this.candidateBirthDate = candidateBirthDate;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public String getEmployerName() {
		return employerName;
	}

	public void setEmployerName(String employerName) {
		this.employerName = employerName;
	}

	public LocalDateTime getApplicationDate() {
		return applicationDate;
	}

	public void setApplicationDate(LocalDateTime applicationDate) {
		this.applicationDate = applicationDate;
	}

	public JobApplicationStatus getStatus() {
		return status;
	}

	public void setStatus(JobApplicationStatus status) {
		this.status = status;
	}

	public String getResumeUrl() {
		return resumeUrl;
	}

	public void setResumeUrl(String resumeUrl) {
		this.resumeUrl = resumeUrl;
	}
}
