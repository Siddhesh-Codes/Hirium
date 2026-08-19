package hrms.hrms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DepartmentRequest {

    @NotBlank(message = "Department name is required.")
    @Size(min = 2, max = 100)
    private String name;

    @NotBlank(message = "Department code is required.")
    @Size(min = 2, max = 20)
    private String code;

    private String description;
    private String managerName;

    public DepartmentRequest() {
    }

    public DepartmentRequest(String name, String code, String description, String managerName) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.managerName = managerName;
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
