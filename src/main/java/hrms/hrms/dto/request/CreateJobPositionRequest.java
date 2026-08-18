package hrms.hrms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateJobPositionRequest {

	@NotBlank(message = "Title cannot be blank.")
	@Size(min = 2, max = 150, message = "Title must be between 2 and 150 characters.")
	private String title;

	public CreateJobPositionRequest() {
	}

	public CreateJobPositionRequest(String title) {
		this.title = title;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
}
