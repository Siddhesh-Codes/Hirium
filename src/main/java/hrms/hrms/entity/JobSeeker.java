package hrms.hrms.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "job_seekers")
public class JobSeeker {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_seeker_id")
    private Integer id;

    @NotBlank(message = "First name cannot be blank.")
    @Size(min = 2, max = 100, message = "First name must be between 2 and 100 characters.")
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Last name cannot be blank.")
    @Size(min = 2, max = 100, message = "Last name must be between 2 and 100 characters.")
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @NotBlank(message = "National ID cannot be blank.")
    @Size(min = 10, max = 20, message = "National ID must be between 10 and 20 characters.")
    @Column(name = "national_id", nullable = false, length = 20, unique = true)
    private String nationalId;

    @NotNull(message = "Birth date is required.")
    @Past(message = "Birth date must be in the past.")
    @Column(name = "birthDate", nullable = false)
    private LocalDate birthDate;

    @NotBlank(message = "Email cannot be blank.")
    @Email(message = "Invalid email format.")
    @Size(max = 180, message = "Email must be at most 180 characters.")
    @Column(name = "email", nullable = false, length = 180, unique = true)
    private String email;

    @NotBlank(message = "Password cannot be blank.")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters.")
    @JsonIgnore
    @Column(name = "password", nullable = false, length = 100)
    private String password;

    public JobSeeker() {
    }

    public JobSeeker(Integer id, String name, String lastName, String nationalId, LocalDate birthDate, String email, String password) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.nationalId = nationalId;
        this.birthDate = birthDate;
        this.email = email;
        this.password = password;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}