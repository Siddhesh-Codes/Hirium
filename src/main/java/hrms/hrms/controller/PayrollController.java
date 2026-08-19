package hrms.hrms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hrms.hrms.business.abstracts.PayrollService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.PayrollDto;
import hrms.hrms.dto.request.PayrollGenerateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payroll")
@Tag(name = "Payroll", description = "Payroll Processing & Payslip Management APIs")
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @PostMapping("/generate")
    @Operation(summary = "HR/Admin 1-click monthly payroll calculation for all active employees")
    public ResponseEntity<Result> generate(@Valid @RequestBody PayrollGenerateRequest request) {
        Result res = payrollService.generateMonthlyPayroll(request);
        if (!res.getSucces()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @GetMapping("/by-period")
    @Operation(summary = "Get payroll records for a specific month and year")
    public ResponseEntity<DataResult<List<PayrollDto>>> getByPeriod(
            @RequestParam Integer month,
            @RequestParam Integer year
    ) {
        return ResponseEntity.ok(payrollService.getByPeriod(month, year));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get payslips history for a specific employee")
    public ResponseEntity<DataResult<List<PayrollDto>>> getEmployeePayslips(@PathVariable Integer employeeId) {
        return ResponseEntity.ok(payrollService.getEmployeePayslips(employeeId));
    }

    @GetMapping("/getById/{id}")
    @Operation(summary = "Get detailed payslip record by ID")
    public ResponseEntity<DataResult<PayrollDto>> getById(@PathVariable Integer id) {
        DataResult<PayrollDto> res = payrollService.getById(id);
        if (!res.getSucces()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}/mark-paid")
    @Operation(summary = "HR/Admin mark payroll record as PAID")
    public ResponseEntity<Result> markAsPaid(@PathVariable Integer id) {
        Result res = payrollService.markAsPaid(id);
        if (!res.getSucces()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @GetMapping("/getAll")
    @Operation(summary = "List all company payroll records")
    public ResponseEntity<DataResult<List<PayrollDto>>> getAll() {
        return ResponseEntity.ok(payrollService.getAll());
    }
}
