package hrms.hrms.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public class CreateJobAdvertisementRequest {

	@NotNull
	private Integer jobPositionId;

	@NotNull
	private Integer cityId;

	@NotNull
	private Integer employerId;

	@NotBlank
	@Size(min = 10, max = 5000)
	private String description;

	@NotNull
	@Positive
	private Integer openPositionCount;

	@PositiveOrZero
	private Integer minSalary;

	@PositiveOrZero
	private Integer maxSalary;

	@NotNull
	@Future
	private LocalDate applicationDeadline;

	public CreateJobAdvertisementRequest() {
	}

	public CreateJobAdvertisementRequest(Integer jobPositionId, Integer cityId, Integer employerId,
			String description, Integer openPositionCount, Integer minSalary, Integer maxSalary,
			LocalDate applicationDeadline) {
		this.jobPositionId = jobPositionId;
		this.cityId = cityId;
		this.employerId = employerId;
		this.description = description;
		this.openPositionCount = openPositionCount;
		this.minSalary = minSalary;
		this.maxSalary = maxSalary;
		this.applicationDeadline = applicationDeadline;
	}

	public Integer getJobPositionId() {
		return jobPositionId;
	}

	public void setJobPositionId(Integer jobPositionId) {
		this.jobPositionId = jobPositionId;
	}

	public Integer getCityId() {
		return cityId;
	}

	public void setCityId(Integer cityId) {
		this.cityId = cityId;
	}

	public Integer getEmployerId() {
		return employerId;
	}

	public void setEmployerId(Integer employerId) {
		this.employerId = employerId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getOpenPositionCount() {
		return openPositionCount;
	}

	public void setOpenPositionCount(Integer openPositionCount) {
		this.openPositionCount = openPositionCount;
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

	public LocalDate getApplicationDeadline() {
		return applicationDeadline;
	}

	public void setApplicationDeadline(LocalDate applicationDeadline) {
		this.applicationDeadline = applicationDeadline;
	}
}
