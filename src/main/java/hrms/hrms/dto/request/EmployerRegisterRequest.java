package hrms.hrms.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class EmployerRegisterRequest {

	@NotBlank(message = "Company name cannot be blank.")
	@Size(min = 2, max = 200, message = "Company name must be between 2 and 200 characters.")
	private String companyName;

	@NotBlank(message = "Website cannot be blank.")
	@Size(max = 255, message = "Website must be at most 255 characters.")
	private String companyWebPage;

	@NotBlank(message = "Email cannot be blank.")
	@Email(message = "Invalid email format.")
	@Size(max = 180, message = "Email must be at most 180 characters.")
	private String email;

	@NotBlank(message = "Phone number cannot be blank.")
	@Size(min = 10, max = 30, message = "Phone number must be between 10 and 30 characters.")
	private String phoneNumber;

	@NotBlank(message = "Password cannot be blank.")
	@Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters.")
	private String password;

	@NotBlank(message = "Confirm password cannot be blank.")
	@Size(min = 6, max = 100, message = "Confirm password must be between 6 and 100 characters.")
	private String confirmPassword;

	public EmployerRegisterRequest() {
	}

	public EmployerRegisterRequest(String companyName, String companyWebPage, String email, String phoneNumber,
			String password, String confirmPassword) {
		this.companyName = companyName;
		this.companyWebPage = companyWebPage;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.password = password;
		this.confirmPassword = confirmPassword;
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

	public String getConfirmPassword() {
		return confirmPassword;
	}

	public void setConfirmPassword(String confirmPassword) {
		this.confirmPassword = confirmPassword;
	}
}
