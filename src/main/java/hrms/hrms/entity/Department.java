package hrms.hrms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "department_id")
    private Integer id;

    @NotBlank(message = "Department name is required.")
    @Size(min = 2, max = 100, message = "Department name must be between 2 and 100 characters.")
    @Column(name = "name", nullable = false, length = 100, unique = true)
    private String name;

    @NotBlank(message = "Department code is required.")
    @Size(min = 2, max = 20, message = "Department code must be between 2 and 20 characters.")
    @Column(name = "code", nullable = false, length = 20, unique = true)
    private String code;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "manager_name", length = 100)
    private String managerName;

    public Department() {
    }

    public Department(String name, String code, String description, String managerName) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.managerName = managerName;
    }

    public Department(Integer id, String name, String code, String description, String managerName) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.managerName = managerName;
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }
}
