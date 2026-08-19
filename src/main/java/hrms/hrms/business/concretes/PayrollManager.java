package hrms.hrms.business.concretes;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import hrms.hrms.business.abstracts.PayrollService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.ErrorDataResult;
import hrms.hrms.core.utilities.ErrorResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.core.utilities.SuccessDataResult;
import hrms.hrms.core.utilities.SuccessResult;
import hrms.hrms.dto.PayrollDto;
import hrms.hrms.dto.request.PayrollGenerateRequest;
import hrms.hrms.entity.Employee;
import hrms.hrms.entity.Payroll;
import hrms.hrms.repository.EmployeeDao;
import hrms.hrms.repository.PayrollDao;

@Service
public class PayrollManager implements PayrollService {

    private final PayrollDao payrollDao;
    private final EmployeeDao employeeDao;

    public PayrollManager(PayrollDao payrollDao, EmployeeDao employeeDao) {
        this.payrollDao = payrollDao;
        this.employeeDao = employeeDao;
    }

    private PayrollDto toDto(Payroll p) {
        String deptName = p.getEmployee().getDepartment() != null ? p.getEmployee().getDepartment().getName() : "General";
        return new PayrollDto(
                p.getId(),
                p.getEmployee().getId(),
                p.getEmployee().getFirstName() + " " + p.getEmployee().getLastName(),
                p.getEmployee().getEmail(),
                deptName,
                p.getEmployee().getJobTitle(),
                p.getMonth(),
                p.getYear(),
                p.getBasicSalary(),
                p.getAllowances(),
                p.getDeductions(),
                p.getNetSalary(),
                p.getStatus(),
                p.getPaymentDate()
        );
    }

    @Override
    public Result generateMonthlyPayroll(PayrollGenerateRequest request) {
        List<Employee> activeEmployees = employeeDao.findByStatus("ACTIVE");
        if (activeEmployees.isEmpty()) {
            return new ErrorResult("No active employees found to generate payroll.");
        }

        int generatedCount = 0;
        for (Employee emp : activeEmployees) {
            Optional<Payroll> existing = payrollDao.findByEmployeeIdAndMonthAndYear(emp.getId(), request.getMonth(), request.getYear());
            if (existing.isEmpty()) {
                double base = emp.getSalary() != null ? emp.getSalary() : 45000.0;
                double allowances = Math.round((base * 0.15) * 100.0) / 100.0; // Standard 15% HRA/Special allowances
                double deductions = Math.round((base * 0.10) * 100.0) / 100.0; // Standard 10% PF/Tax deductions
                double net = Math.round((base + allowances - deductions) * 100.0) / 100.0;

                Payroll p = new Payroll();
                p.setEmployee(emp);
                p.setMonth(request.getMonth());
                p.setYear(request.getYear());
                p.setBasicSalary(base);
                p.setAllowances(allowances);
                p.setDeductions(deductions);
                p.setNetSalary(net);
                p.setStatus("PROCESSED");
                p.setPaymentDate(LocalDate.of(request.getYear(), request.getMonth(), 28));

                payrollDao.save(p);
                generatedCount++;
            }
        }

        return new SuccessResult("Generated " + generatedCount + " payroll records for period " + request.getMonth() + "/" + request.getYear() + ".");
    }

    @Override
    public DataResult<List<PayrollDto>> getByPeriod(Integer month, Integer year) {
        List<PayrollDto> list = payrollDao.findByMonthAndYear(month, year).stream().map(this::toDto).toList();
        return new SuccessDataResult<>(list, "Payroll records retrieved for period " + month + "/" + year + ".");
    }

    @Override
    public DataResult<List<PayrollDto>> getEmployeePayslips(Integer employeeId) {
        List<PayrollDto> list = payrollDao.findByEmployeeIdOrderByYearDescMonthDesc(employeeId).stream().map(this::toDto).toList();
        return new SuccessDataResult<>(list, "Employee payslips retrieved.");
    }

    @Override
    public DataResult<PayrollDto> getById(Integer id) {
        Optional<Payroll> opt = payrollDao.findById(id);
        if (opt.isEmpty()) {
            return new ErrorDataResult<>("Payroll record not found with ID: " + id);
        }
        return new SuccessDataResult<>(toDto(opt.get()), "Payroll record retrieved.");
    }

    @Override
    public Result markAsPaid(Integer payrollId) {
        Optional<Payroll> opt = payrollDao.findById(payrollId);
        if (opt.isEmpty()) {
            return new ErrorResult("Payroll record not found with ID: " + payrollId);
        }
        Payroll p = opt.get();
        p.setStatus("PAID");
        p.setPaymentDate(LocalDate.now());
        payrollDao.save(p);
        return new SuccessResult("Payroll #" + payrollId + " marked as PAID.");
    }

    @Override
    public DataResult<List<PayrollDto>> getAll() {
        List<PayrollDto> list = payrollDao.findAllByOrderByYearDescMonthDesc().stream().map(this::toDto).toList();
        return new SuccessDataResult<>(list, "All payroll records retrieved.");
    }
}
