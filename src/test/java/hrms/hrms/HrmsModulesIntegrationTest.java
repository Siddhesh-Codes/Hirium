package hrms.hrms;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.time.LocalTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import hrms.hrms.business.abstracts.AttendanceService;
import hrms.hrms.business.abstracts.DepartmentService;
import hrms.hrms.business.abstracts.EmployeeService;
import hrms.hrms.business.abstracts.LeaveService;
import hrms.hrms.business.abstracts.PayrollService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.AttendanceDto;
import hrms.hrms.dto.DepartmentDto;
import hrms.hrms.dto.EmployeeDto;
import hrms.hrms.dto.LeaveRequestDto;
import hrms.hrms.dto.PayrollDto;
import hrms.hrms.dto.request.AttendanceCheckInRequest;
import hrms.hrms.dto.request.AttendanceCheckOutRequest;
import hrms.hrms.dto.request.DepartmentRequest;
import hrms.hrms.dto.request.EmployeeRequest;
import hrms.hrms.dto.request.LeaveApplyRequest;
import hrms.hrms.dto.request.LeaveReviewRequest;
import hrms.hrms.dto.request.PayrollGenerateRequest;
import hrms.hrms.entity.Department;
import hrms.hrms.entity.Employee;
import hrms.hrms.repository.DepartmentDao;
import hrms.hrms.repository.EmployeeDao;
import hrms.hrms.security.model.UserRole;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class HrmsModulesIntegrationTest {

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private LeaveService leaveService;

    @Autowired
    private PayrollService payrollService;

    @Autowired
    private DepartmentDao departmentDao;

    @Autowired
    private EmployeeDao employeeDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Department testDept;
    private Employee testEmp;

    @BeforeEach
    public void setUp() {
        testDept = departmentDao.save(new Department("QA & Testing", "QA", "Quality Assurance and Automation", "Test Manager"));
        testEmp = employeeDao.save(new Employee(
                "Rohan",
                "Sharma",
                "rohan.sharma" + System.nanoTime() + "@test.com",
                passwordEncoder.encode("Pass123!"),
                "+91 9988776655",
                testDept,
                "QA Engineer",
                UserRole.EMPLOYEE,
                "ACTIVE",
                LocalDate.now().minusMonths(6),
                60000.0
        ));
    }

    @Test
    public void testDepartmentCRUD() {
        Result addRes = departmentService.add(new DepartmentRequest("Legal & Compliance", "LGL", "Legal affairs", "Lawyer"));
        assertTrue(addRes.getSucces());

        DataResult<java.util.List<DepartmentDto>> listRes = departmentService.getAll();
        assertTrue(listRes.getSucces());
        assertTrue(listRes.getData().size() >= 2);
    }

    @Test
    public void testEmployeeLifecycle() {
        EmployeeRequest req = new EmployeeRequest(
                "Aarav",
                "Patel",
                "aarav.patel" + System.nanoTime() + "@test.com",
                "Secret123!",
                "+91 9123456789",
                testDept.getId(),
                "Frontend Dev",
                UserRole.EMPLOYEE,
                "ACTIVE",
                LocalDate.now(),
                55000.0
        );

        Result res = employeeService.add(req);
        assertTrue(res.getSucces());

        DataResult<EmployeeDto> findRes = employeeService.getByEmail(req.getEmail());
        assertTrue(findRes.getSucces());
        assertEquals("Aarav Patel", findRes.getData().getFullName());
    }

    @Test
    public void testAttendanceWorkflow() {
        Result inRes = attendanceService.checkIn(new AttendanceCheckInRequest(testEmp.getId(), "Morning punch"));
        assertTrue(inRes.getSucces());

        DataResult<AttendanceDto> todayRes = attendanceService.getTodayAttendance(testEmp.getId());
        assertTrue(todayRes.getSucces());
        assertNotNull(todayRes.getData().getCheckInTime());

        Result outRes = attendanceService.checkOut(new AttendanceCheckOutRequest(testEmp.getId(), "Evening punch"));
        assertTrue(outRes.getSucces());
    }

    @Test
    public void testLeaveApplicationAndReview() {
        LocalDate start = LocalDate.now().plusDays(5);
        LocalDate end = LocalDate.now().plusDays(7);

        Result applyRes = leaveService.apply(new LeaveApplyRequest(testEmp.getId(), "CASUAL", start, end, "Attending conference"));
        assertTrue(applyRes.getSucces());

        DataResult<java.util.List<LeaveRequestDto>> leaves = leaveService.getEmployeeLeaves(testEmp.getId());
        assertTrue(leaves.getSucces());
        assertEquals(1, leaves.getData().size());

        Integer leaveId = leaves.getData().get(0).getId();
        Result reviewRes = leaveService.review(leaveId, new LeaveReviewRequest("APPROVED", null));
        assertTrue(reviewRes.getSucces());

        DataResult<java.util.List<LeaveRequestDto>> updatedLeaves = leaveService.getEmployeeLeaves(testEmp.getId());
        assertEquals("APPROVED", updatedLeaves.getData().get(0).getStatus());
    }

    @Test
    public void testPayrollGeneration() {
        LocalDate today = LocalDate.now();
        Result genRes = payrollService.generateMonthlyPayroll(new PayrollGenerateRequest(today.getMonthValue(), today.getYear()));
        assertTrue(genRes.getSucces());

        DataResult<java.util.List<PayrollDto>> payslips = payrollService.getEmployeePayslips(testEmp.getId());
        assertTrue(payslips.getSucces());
        assertTrue(!payslips.getData().isEmpty());
        assertTrue(payslips.getData().get(0).getNetSalary() > 0);
    }
}
