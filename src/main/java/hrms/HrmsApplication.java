package hrms;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;

import hrms.hrms.entity.City;
import hrms.hrms.entity.JobPosition;
import hrms.hrms.repository.CityDao;
import hrms.hrms.repository.JobPositionDao;

@SpringBootApplication
public class HrmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(HrmsApplication.class, args);
	}

	@Bean
	@Profile("!test")
	public CommandLineRunner dataInitializer(
			JobPositionDao jobPositionDao,
			CityDao cityDao,
			JdbcTemplate jdbcTemplate
	) {
		return args -> {
			// Auto schema migrations
			try {
				jdbcTemplate.execute("ALTER TABLE job_seekers ALTER COLUMN national_id DROP NOT NULL");
			} catch (Exception ignored) {
			}

			// 1. Seed Metadata Positions
			List<String> defaultPositions = Arrays.asList(
				"Software Engineer",
				"Frontend Developer",
				"Backend Developer",
				"Full Stack Developer",
				"Java Developer",
				"DevOps Engineer",
				"Product Manager",
				"UI/UX Designer",
				"Data Analyst",
				"HR Manager",
				"Business Analyst",
				"Quality Assurance Engineer"
			);
			for (String title : defaultPositions) {
				if (jobPositionDao.findByTitle(title).isEmpty()) {
					jobPositionDao.save(new JobPosition(title));
				}
			}

			// 2. Seed Metadata Cities
			List<String> defaultCities = Arrays.asList(
				"Mumbai",
				"Bengaluru",
				"Delhi NCR",
				"Hyderabad",
				"Pune",
				"Chennai",
				"Kolkata",
				"Ahmedabad",
				"Jaipur",
				"Noida",
				"Gurugram",
				"Remote"
			);
			for (String cityName : defaultCities) {
				if (cityDao.findByCityName(cityName).isEmpty()) {
					cityDao.save(new City(cityName));
				}
			}
		};
	}

}
