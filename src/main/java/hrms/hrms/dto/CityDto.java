package hrms.hrms.dto;

public class CityDto {

	private Integer id;
	private String cityName;

	public CityDto() {
	}

	public CityDto(Integer id, String cityName) {
		this.id = id;
		this.cityName = cityName;
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
}
