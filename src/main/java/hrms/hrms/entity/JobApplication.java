package hrms.hrms.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(
	    name = "job_applications",
	    uniqueConstraints = @UniqueConstraint(columnNames = {"job_advertisement_id", "job_seeker_id"})
	)
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_application_id")
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "job_advertisement_id", nullable = false)
    private JobAdvertisement jobAdvertisement;

    @ManyToOne(optional = false)
    @JoinColumn(name = "job_seeker_id", nullable = false)
    private JobSeeker jobSeeker;

    @Column(name = "application_date", nullable = false)
    private LocalDateTime applicationDate = LocalDateTime.now();

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private JobApplicationStatus status = JobApplicationStatus.PENDING;

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    public JobApplication() {
    }

    public JobApplication(Integer id, JobAdvertisement jobAdvertisement, JobSeeker jobSeeker,
            LocalDateTime applicationDate, JobApplicationStatus status) {
        this.id = id;
        this.jobAdvertisement = jobAdvertisement;
        this.jobSeeker = jobSeeker;
        this.applicationDate = applicationDate;
        this.status = status;
    }

    public JobApplication(Integer id, JobAdvertisement jobAdvertisement, JobSeeker jobSeeker,
            LocalDateTime applicationDate, JobApplicationStatus status, String resumeUrl) {
        this.id = id;
        this.jobAdvertisement = jobAdvertisement;
        this.jobSeeker = jobSeeker;
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

    public JobAdvertisement getJobAdvertisement() {
        return jobAdvertisement;
    }

    public void setJobAdvertisement(JobAdvertisement jobAdvertisement) {
        this.jobAdvertisement = jobAdvertisement;
    }

    public JobSeeker getJobSeeker() {
        return jobSeeker;
    }

    public void setJobSeeker(JobSeeker jobSeeker) {
        this.jobSeeker = jobSeeker;
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