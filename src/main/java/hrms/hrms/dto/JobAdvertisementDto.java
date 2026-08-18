package hrms.hrms.dto;

import java.time.LocalDate;

public class JobAdvertisementDto {

	private Integer id;
	private String jobTitle;
	private String companyName;
	private String city;
	private Integer openPositionCount;
	private Integer minSalary;
	private Integer maxSalary;
	private LocalDate releaseDate;
	private LocalDate applicationDeadline;
	private boolean active;
	private String description;
	private Integer employerId;
	private Integer cityId;
	private Integer jobPositionId;
	private String companyWebPage;
	private String companyEmail;
	private String companyPhoneNumber;

	public JobAdvertisementDto() {
	}

	public JobAdvertisementDto(Integer id, String jobTitle, String companyName, String city,
			Integer openPositionCount, Integer minSalary, Integer maxSalary, LocalDate releaseDate,
			LocalDate applicationDeadline, boolean active) {
		this.id = id;
		this.jobTitle = jobTitle;
		this.companyName = companyName;
		this.city = city;
		this.openPositionCount = openPositionCount;
		this.minSalary = minSalary;
		this.maxSalary = maxSalary;
		this.releaseDate = releaseDate;
		this.applicationDeadline = applicationDeadline;
		this.active = active;
	}

	public JobAdvertisementDto(Integer id, String jobTitle, String companyName, String city,
			Integer openPositionCount, Integer minSalary, Integer maxSalary, LocalDate releaseDate,
			LocalDate applicationDeadline, boolean active, String description, Integer employerId,
			Integer cityId, Integer jobPositionId, String companyWebPage, String companyEmail,
			String companyPhoneNumber) {
		this.id = id;
		this.jobTitle = jobTitle;
		this.companyName = companyName;
		this.city = city;
		this.openPositionCount = openPositionCount;
		this.minSalary = minSalary;
		this.maxSalary = maxSalary;
		this.releaseDate = releaseDate;
		this.applicationDeadline = applicationDeadline;
		this.active = active;
		this.description = description;
		this.employerId = employerId;
		this.cityId = cityId;
		this.jobPositionId = jobPositionId;
		this.companyWebPage = companyWebPage;
		this.companyEmail = companyEmail;
		this.companyPhoneNumber = companyPhoneNumber;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
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

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getEmployerId() {
		return employerId;
	}

	public void setEmployerId(Integer employerId) {
		this.employerId = employerId;
	}

	public Integer getCityId() {
		return cityId;
	}

	public void setCityId(Integer cityId) {
		this.cityId = cityId;
	}

	public Integer getJobPositionId() {
		return jobPositionId;
	}

	public void setJobPositionId(Integer jobPositionId) {
		this.jobPositionId = jobPositionId;
	}

	public String getCompanyWebPage() {
		return companyWebPage;
	}

	public void setCompanyWebPage(String companyWebPage) {
		this.companyWebPage = companyWebPage;
	}

	public String getCompanyEmail() {
		return companyEmail;
	}

	public void setCompanyEmail(String companyEmail) {
		this.companyEmail = companyEmail;
	}

	public String getCompanyPhoneNumber() {
		return companyPhoneNumber;
	}

	public void setCompanyPhoneNumber(String companyPhoneNumber) {
		this.companyPhoneNumber = companyPhoneNumber;
	}
}
