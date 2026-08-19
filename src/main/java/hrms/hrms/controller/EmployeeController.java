package hrms.hrms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hrms.hrms.business.abstracts.EmployeeService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.EmployeeDto;
import hrms.hrms.dto.request.EmployeeRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employees")
@Tag(name = "Employees", description = "Employee Directory and Staff Management APIs")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/getAll")
    @Operation(summary = "List all company employees")
    public ResponseEntity<DataResult<List<EmployeeDto>>> getAll() {
        return ResponseEntity.ok(employeeService.getAll());
    }

    @GetMapping("/getById/{id}")
    @Operation(summary = "Get employee profile by ID")
    public ResponseEntity<DataResult<EmployeeDto>> getById(@PathVariable Integer id) {
        DataResult<EmployeeDto> res = employeeService.getById(id);
        if (!res.getSucces()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @GetMapping("/by-department/{departmentId}")
    @Operation(summary = "Get employees belonging to a specific department")
    public ResponseEntity<DataResult<List<EmployeeDto>>> getByDepartment(@PathVariable Integer departmentId) {
        return ResponseEntity.ok(employeeService.getByDepartment(departmentId));
    }

    @GetMapping("/by-email")
    @Operation(summary = "Find employee by email address")
    public ResponseEntity<DataResult<EmployeeDto>> getByEmail(@RequestParam String email) {
        DataResult<EmployeeDto> res = employeeService.getByEmail(email);
        if (!res.getSucces()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @PostMapping("/add")
    @Operation(summary = "Add a new employee to the organization")
    public ResponseEntity<Result> add(@Valid @RequestBody EmployeeRequest request) {
        Result res = employeeService.add(request);
        if (!res.getSucces()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Update employee information")
    public ResponseEntity<Result> update(@PathVariable Integer id, @Valid @RequestBody EmployeeRequest request) {
        Result res = employeeService.update(id, request);
        if (!res.getSucces()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @PostMapping("/change-password")
    @Operation(summary = "Update employee password on first login or profile change")
    public ResponseEntity<Result> changePassword(@Valid @RequestBody hrms.hrms.dto.request.ChangePasswordRequest request) {
        Result res = employeeService.changePassword(request.getEmployeeId(), request.getOldPassword(), request.getNewPassword());
        if (!res.getSucces()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Remove an employee record")
    public ResponseEntity<Result> delete(@PathVariable Integer id) {
        Result res = employeeService.delete(id);
        if (!res.getSucces()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }
}
