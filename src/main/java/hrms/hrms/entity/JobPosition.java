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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "job_positions", uniqueConstraints = @UniqueConstraint(columnNames = "title"))
public class JobPosition {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "job_position_id")
	private Integer id;

    @NotBlank(message = "Job position title cannot be blank.")
    @Size(min = 2, max = 150, message = "Job position title must be between 2 and 150 characters.")
    @Column(name = "title", nullable = false, length = 150, unique = true)
	private String title;

	@OneToMany(mappedBy = "jobPosition", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<JobAdvertisement> jobAdvertisements;

	public JobPosition() {
	}

	public JobPosition(String title) {
		this.title = title;
	}

	public JobPosition(Integer id, String title, List<JobAdvertisement> jobAdvertisements) {
		this.id = id;
		this.title = title;
		this.jobAdvertisements = jobAdvertisements;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public List<JobAdvertisement> getJobAdvertisements() {
		return jobAdvertisements;
	}

	public void setJobAdvertisements(List<JobAdvertisement> jobAdvertisements) {
		this.jobAdvertisements = jobAdvertisements;
	}
}
