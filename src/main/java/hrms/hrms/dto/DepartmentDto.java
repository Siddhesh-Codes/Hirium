package hrms.hrms.dto;

public class DepartmentDto {
    private Integer id;
    private String name;
    private String code;
    private String description;
    private String managerName;
    private Long employeeCount;

    public DepartmentDto() {
    }

    public DepartmentDto(Integer id, String name, String code, String description, String managerName, Long employeeCount) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.managerName = managerName;
        this.employeeCount = employeeCount;
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

    public Long getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(Long employeeCount) {
        this.employeeCount = employeeCount;
    }
}
