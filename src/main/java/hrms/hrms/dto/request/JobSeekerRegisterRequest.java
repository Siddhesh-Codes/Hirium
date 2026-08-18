package hrms.hrms.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

public class JobSeekerRegisterRequest {

	@NotBlank(message = "First name cannot be blank.")
	@Size(min = 2, max = 100, message = "First name must be between 2 and 100 characters.")
	private String name;

	@NotBlank(message = "Last name cannot be blank.")
	@Size(min = 2, max = 100, message = "Last name must be between 2 and 100 characters.")
	private String lastName;

	@NotBlank(message = "National ID cannot be blank.")
	@Size(min = 10, max = 20, message = "National ID must be between 10 and 20 characters.")
	private String nationalId;

	@NotNull(message = "Birth date is required.")
	@Past(message = "Birth date must be in the past.")
	private LocalDate birthDate;

	@NotBlank(message = "Email cannot be blank.")
	@Email(message = "Invalid email format.")
	@Size(max = 180, message = "Email must be at most 180 characters.")
	private String email;

	@NotBlank(message = "Password cannot be blank.")
	@Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters.")
	private String password;

	@NotBlank(message = "Confirm password cannot be blank.")
	@Size(min = 6, max = 100, message = "Confirm password must be between 6 and 100 characters.")
	private String confirmPassword;

	public JobSeekerRegisterRequest() {
	}

	public JobSeekerRegisterRequest(String name, String lastName, String nationalId, LocalDate birthDate,
			String email, String password, String confirmPassword) {
		this.name = name;
		this.lastName = lastName;
		this.nationalId = nationalId;
		this.birthDate = birthDate;
		this.email = email;
		this.password = password;
		this.confirmPassword = confirmPassword;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getNationalId() {
		return nationalId;
	}

	public void setNationalId(String nationalId) {
		this.nationalId = nationalId;
	}

	public LocalDate getBirthDate() {
		return birthDate;
	}

	public void setBirthDate(LocalDate birthDate) {
		this.birthDate = birthDate;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getConfirmPassword() {
		return confirmPassword;
	}

	public void setConfirmPassword(String confirmPassword) {
		this.confirmPassword = confirmPassword;
	}
}
