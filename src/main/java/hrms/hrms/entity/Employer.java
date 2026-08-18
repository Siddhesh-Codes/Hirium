package hrms.hrms.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "employers", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class Employer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;

	@NotBlank(message = "Company name cannot be blank.")
	@Size(min = 2, max = 200, message = "Company name must be between 2 and 200 characters.")
	@Column(name = "company_name", nullable = false, length = 200)
	private String companyName;

	@NotBlank(message = "Website cannot be blank.")
	@Size(max = 255, message = "Website must be at most 255 characters.")
	@Column(name = "web_page", nullable = false, length = 255)
	private String companyWebPage;

	@NotBlank(message = "Email cannot be blank.")
	@Email(message = "Invalid email format.")
	@Size(max = 180, message = "Email must be at most 180 characters.")
	@Column(name = "email", nullable = false, length = 180, unique = true)
	private String email;

	@NotBlank(message = "Phone number cannot be blank.")
	@Size(min = 10, max = 30, message = "Phone number must be between 10 and 30 characters.")
	@Column(name = "phone_number", nullable = false, length = 30)
	private String phoneNumber;

	@NotBlank(message = "Password cannot be blank.")
	@Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters.")
	@JsonIgnore
	@Column(name = "password", nullable = false, length = 100)
	private String password;

	@OneToMany(mappedBy = "employer", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<JobAdvertisement> jobAdvertisements;

	public Employer() {
	}

	public Employer(Integer id, String companyName, String companyWebPage, String email, String phoneNumber,
			String password, List<JobAdvertisement> jobAdvertisements) {
		this.id = id;
		this.companyName = companyName;
		this.companyWebPage = companyWebPage;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.password = password;
		this.jobAdvertisements = jobAdvertisements;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getCompanyWebPage() {
		return companyWebPage;
	}

	public void setCompanyWebPage(String companyWebPage) {
		this.companyWebPage = companyWebPage;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public List<JobAdvertisement> getJobAdvertisements() {
		return jobAdvertisements;
	}

	public void setJobAdvertisements(List<JobAdvertisement> jobAdvertisements) {
		this.jobAdvertisements = jobAdvertisements;
	}
}