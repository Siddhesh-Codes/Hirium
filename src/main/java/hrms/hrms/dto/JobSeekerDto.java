package hrms.hrms.dto;

import java.time.LocalDate;

public class JobSeekerDto {

	private Integer id;
	private String name;
	private String lastName;
	private String nationalId;
	private LocalDate birthDate;
	private String email;

	public JobSeekerDto() {
	}

	public JobSeekerDto(Integer id, String name, String lastName, String nationalId, LocalDate birthDate, String email) {
		this.id = id;
		this.name = name;
		this.lastName = lastName;
		this.nationalId = nationalId;
		this.birthDate = birthDate;
		this.email = email;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
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
}
