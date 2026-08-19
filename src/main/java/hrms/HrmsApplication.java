package hrms;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import hrms.hrms.entity.Attendance;
import hrms.hrms.entity.City;
import hrms.hrms.entity.Department;
import hrms.hrms.entity.Employee;
import hrms.hrms.entity.JobPosition;
import hrms.hrms.entity.LeaveRequest;
import hrms.hrms.entity.Payroll;
import hrms.hrms.repository.AttendanceDao;
import hrms.hrms.repository.CityDao;
import hrms.hrms.repository.DepartmentDao;
import hrms.hrms.repository.EmployeeDao;
import hrms.hrms.repository.JobPositionDao;
import hrms.hrms.repository.LeaveRequestDao;
import hrms.hrms.repository.PayrollDao;
import hrms.hrms.security.model.UserRole;

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
			DepartmentDao departmentDao,
			EmployeeDao employeeDao,
			AttendanceDao attendanceDao,
			LeaveRequestDao leaveRequestDao,
			PayrollDao payrollDao,
			PasswordEncoder passwordEncoder,
			JdbcTemplate jdbcTemplate
	) {
		return args -> {
			// Auto schema migrations
			try {
				jdbcTemplate.execute("ALTER TABLE job_seekers ALTER COLUMN national_id DROP NOT NULL");
			} catch (Exception ignored) {
			}

			// 1. Seed Default Positions
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

			// 2. Seed Default Cities
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

			// 3. Seed Default Departments
			Department eng = departmentDao.findByCode("ENG").orElseGet(() ->
					departmentDao.save(new Department("Engineering & Tech", "ENG", "Software engineering and tech infrastructure", "Siddhesh Kulkarni")));
			Department hrDept = departmentDao.findByCode("HR").orElseGet(() ->
					departmentDao.save(new Department("Human Resources", "HR", "People operations, recruitment, and talent management", "Priya Sharma")));
			Department finDept = departmentDao.findByCode("FIN").orElseGet(() ->
					departmentDao.save(new Department("Finance & Accounts", "FIN", "Corporate finance, payroll, and budgeting", "Amit Verma")));
			Department mktDept = departmentDao.findByCode("MKT").orElseGet(() ->
					departmentDao.save(new Department("Marketing & Growth", "MKT", "Brand, growth marketing, and communications", "Neha Kapoor")));
			Department opsDept = departmentDao.findByCode("OPS").orElseGet(() ->
					departmentDao.save(new Department("Operations", "OPS", "Business operations and workplace management", "Rajesh Patil")));

			// 4. Seed Demo Accounts for Presentation
			// Admin Account
			if (employeeDao.findByEmail("admin@hirium.com").isEmpty()) {
				employeeDao.save(new Employee(
						"Admin",
						"Superuser",
						"admin@hirium.com",
						passwordEncoder.encode("Admin123!"),
						"+91 9876543210",
						opsDept,
						"System Administrator",
						UserRole.ADMIN,
						"ACTIVE",
						LocalDate.of(2023, 1, 1),
						150000.0
				));
			}

			// HR Manager Account
			Employee hrUser;
			Optional<Employee> hrOpt = employeeDao.findByEmail("hr@hirium.com");
			if (hrOpt.isEmpty()) {
				hrUser = employeeDao.save(new Employee(
						"Priya",
						"Sharma",
						"hr@hirium.com",
						passwordEncoder.encode("Hr123!"),
						"+91 9876543211",
						hrDept,
						"Senior HR Manager",
						UserRole.HR,
						"ACTIVE",
						LocalDate.of(2023, 3, 15),
						95000.0
				));
			} else {
				hrUser = hrOpt.get();
			}

			// Employee Demo Account
			Employee demoEmployee;
			Optional<Employee> empOpt = employeeDao.findByEmail("employee@hirium.com");
			if (empOpt.isEmpty()) {
				demoEmployee = employeeDao.save(new Employee(
						"Rahul",
						"Mehta",
						"employee@hirium.com",
						passwordEncoder.encode("Emp123!"),
						"+91 9876543212",
						eng,
						"Full Stack Engineer",
						UserRole.EMPLOYEE,
						"ACTIVE",
						LocalDate.of(2023, 6, 1),
						75000.0
				));
			} else {
				demoEmployee = empOpt.get();
			}

			// Additional Sample Employees
			if (employeeDao.findByEmail("ananya.iyer@hirium.com").isEmpty()) {
				employeeDao.save(new Employee("Ananya", "Iyer", "ananya.iyer@hirium.com", passwordEncoder.encode("Emp123!"), "+91 9876543213", eng, "Backend Developer", UserRole.EMPLOYEE, "ACTIVE", LocalDate.of(2023, 8, 1), 70000.0));
			}
			if (employeeDao.findByEmail("vikram.singh@hirium.com").isEmpty()) {
				employeeDao.save(new Employee("Vikram", "Singh", "vikram.singh@hirium.com", passwordEncoder.encode("Emp123!"), "+91 9876543214", finDept, "Financial Analyst", UserRole.EMPLOYEE, "ACTIVE", LocalDate.of(2023, 9, 15), 65000.0));
			}
			if (employeeDao.findByEmail("sneha.deshmukh@hirium.com").isEmpty()) {
				employeeDao.save(new Employee("Sneha", "Deshmukh", "sneha.deshmukh@hirium.com", passwordEncoder.encode("Emp123!"), "+91 9876543215", mktDept, "Growth Lead", UserRole.EMPLOYEE, "ACTIVE", LocalDate.of(2023, 10, 1), 68000.0));
			}

			// 5. Seed Attendance for Today
			LocalDate today = LocalDate.now();
			if (attendanceDao.findByEmployeeIdAndAttendanceDate(demoEmployee.getId(), today).isEmpty()) {
				attendanceDao.save(new Attendance(demoEmployee, today, LocalTime.of(9, 15), LocalTime.of(18, 0), 8.75, "PRESENT", "On-time daily punch"));
			}
			if (attendanceDao.findByEmployeeIdAndAttendanceDate(hrUser.getId(), today).isEmpty()) {
				attendanceDao.save(new Attendance(hrUser, today, LocalTime.of(9, 5), LocalTime.of(17, 45), 8.67, "PRESENT", "HR check-in"));
			}

			// 6. Seed Sample Leaves
			if (leaveRequestDao.findByEmployeeIdOrderByAppliedAtDesc(demoEmployee.getId()).isEmpty()) {
				LeaveRequest pendingLeave = new LeaveRequest(
						demoEmployee,
						"CASUAL",
						today.plusDays(3),
						today.plusDays(4),
						2,
						"Family event in hometown"
				);
				pendingLeave.setStatus("PENDING");
				leaveRequestDao.save(pendingLeave);

				LeaveRequest approvedLeave = new LeaveRequest(
						demoEmployee,
						"SICK",
						today.minusDays(10),
						today.minusDays(9),
						2,
						"Viral recovery doctor advised rest"
				);
				approvedLeave.setStatus("APPROVED");
				approvedLeave.setReviewedAt(LocalDateTime.now().minusDays(9));
				leaveRequestDao.save(approvedLeave);
			}

			// 7. Seed Sample Payroll
			int currentMonth = today.getMonthValue();
			int currentYear = today.getYear();
			if (payrollDao.findByEmployeeIdAndMonthAndYear(demoEmployee.getId(), currentMonth, currentYear).isEmpty()) {
				double base = demoEmployee.getSalary();
				double allowances = Math.round((base * 0.15) * 100.0) / 100.0;
				double deductions = Math.round((base * 0.10) * 100.0) / 100.0;
				double net = Math.round((base + allowances - deductions) * 100.0) / 100.0;

				payrollDao.save(new Payroll(
						demoEmployee,
						currentMonth,
						currentYear,
						base,
						allowances,
						deductions,
						net,
						"PAID",
						today.minusDays(2)
				));
			}
		};
	}

}
