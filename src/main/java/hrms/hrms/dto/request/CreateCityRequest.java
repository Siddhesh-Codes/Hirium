package hrms.hrms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateCityRequest {

	@NotBlank(message = "City name cannot be blank.")
	@Size(min = 2, max = 100, message = "City name must be between 2 and 100 characters.")
	private String cityName;

	public CreateCityRequest() {
	}

	public CreateCityRequest(String cityName) {
		this.cityName = cityName;
	}

	public String getCityName() {
		return cityName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName;
	}
}
