package hrms.hrms.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class PayrollGenerateRequest {

    @NotNull(message = "Month is required (1-12).")
    @Min(value = 1, message = "Month must be between 1 and 12.")
    @Max(value = 12, message = "Month must be between 1 and 12.")
    private Integer month;

    @NotNull(message = "Year is required.")
    @Min(value = 2020, message = "Year must be valid.")
    private Integer year;

    public PayrollGenerateRequest() {
    }

    public PayrollGenerateRequest(Integer month, Integer year) {
        this.month = month;
        this.year = year;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }
}
