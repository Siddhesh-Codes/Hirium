package hrms.hrms.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "job_advertisement")
public class JobAdvertisement {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "job_advertisement_id")
	private Integer id;

	@NotNull(message = "Open position count is required.")
	@Positive(message = "Open position count must be positive.")
	@Column(name = "open_position_count", nullable = false)
	private Integer openPositionCount;

	@NotBlank(message = "Description cannot be blank.")
	@Size(min = 10, max = 5000, message = "Description must be between 10 and 5000 characters.")
	@Column(name = "description", nullable = false, length = 5000)
	private String description;

	@PositiveOrZero(message = "Min salary must be 0 or greater.")
	@Column(name = "min_salary")
	private Integer minSalary;

	@PositiveOrZero(message = "Max salary must be 0 or greater.")
	@Column(name = "max_salary")
	private Integer maxSalary;

	@NotNull(message = "Release date is required.")
	@Column(name = "job_relase_date", nullable = false)
	private LocalDate releaseDate = LocalDate.now();

	@NotNull(message = "Application deadline is required.")
	@Future(message = "Application deadline must be in the future.")
	@Column(name = "application_deadline", nullable = false)
	private LocalDate applicationDeadline;

	@NotNull(message = "Job position is required.")
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "job_position_id", nullable = false)
	private JobPosition jobPosition;

	@NotNull(message = "City is required.")
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "city_id", nullable = false)
	private City city;

	@NotNull(message = "Employer is required.")
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employer_id", nullable = false)
	private Employer employer;

	@Column(name = "active", nullable = false)
	private boolean active = true;

	public JobAdvertisement() {
	}

	public JobAdvertisement(Integer id, Integer openPositionCount, String description, Integer minSalary,
			Integer maxSalary, LocalDate releaseDate, LocalDate applicationDeadline, JobPosition jobPosition,
			City city, Employer employer, boolean active) {
		this.id = id;
		this.openPositionCount = openPositionCount;
		this.description = description;
		this.minSalary = minSalary;
		this.maxSalary = maxSalary;
		this.releaseDate = releaseDate;
		this.applicationDeadline = applicationDeadline;
		this.jobPosition = jobPosition;
		this.city = city;
		this.employer = employer;
		this.active = active;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getOpenPositionCount() {
		return openPositionCount;
	}

	public void setOpenPositionCount(Integer openPositionCount) {
		this.openPositionCount = openPositionCount;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getMinSalary() {
		return minSalary;
	}

	public void setMinSalary(Integer minSalary) {
		this.minSalary = minSalary;
	}

	public Integer getMaxSalary() {
		return maxSalary;
	}

	public void setMaxSalary(Integer maxSalary) {
		this.maxSalary = maxSalary;
	}

	public LocalDate getReleaseDate() {
		return releaseDate;
	}

	public void setReleaseDate(LocalDate releaseDate) {
		this.releaseDate = releaseDate;
	}

	public LocalDate getApplicationDeadline() {
		return applicationDeadline;
	}

	public void setApplicationDeadline(LocalDate applicationDeadline) {
		this.applicationDeadline = applicationDeadline;
	}

	public JobPosition getJobPosition() {
		return jobPosition;
	}

	public void setJobPosition(JobPosition jobPosition) {
		this.jobPosition = jobPosition;
	}

	public City getCity() {
		return city;
	}

	public void setCity(City city) {
		this.city = city;
	}

	public Employer getEmployer() {
		return employer;
	}

	public void setEmployer(Employer employer) {
		this.employer = employer;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}
}