package hrms.hrms.dto;

public class EmployerDto {

	private Integer id;
	private String companyName;
	private String companyWebPage;
	private String email;
	private String phoneNumber;

	public EmployerDto() {
	}

	public EmployerDto(Integer id, String companyName, String companyWebPage, String email, String phoneNumber) {
		this.id = id;
		this.companyName = companyName;
		this.companyWebPage = companyWebPage;
		this.email = email;
		this.phoneNumber = phoneNumber;
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
}
