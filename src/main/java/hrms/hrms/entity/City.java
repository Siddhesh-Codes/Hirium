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
@Table(name = "cities", uniqueConstraints = @UniqueConstraint(columnNames = "city_name"))
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "city_id")
    private Integer id;

    @NotBlank(message = "City name cannot be blank.")
    @Size(min = 2, max = 100, message = "City name must be between 2 and 100 characters.")
    @Column(name = "city_name", nullable = false, length = 100, unique = true)
    private String cityName;

    @OneToMany(mappedBy = "city", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<JobAdvertisement> jobAdvertisements;

    public City() {
    }

    public City(String cityName) {
        this.cityName = cityName;
    }

    public City(Integer id, String cityName, List<JobAdvertisement> jobAdvertisements) {
        this.id = id;
        this.cityName = cityName;
        this.jobAdvertisements = jobAdvertisements;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public List<JobAdvertisement> getJobAdvertisements() {
        return jobAdvertisements;
    }

    public void setJobAdvertisements(List<JobAdvertisement> jobAdvertisements) {
        this.jobAdvertisements = jobAdvertisements;
    }
}