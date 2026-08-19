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
import org.springframework.web.bind.annotation.RestController;

import hrms.hrms.business.abstracts.DepartmentService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.DepartmentDto;
import hrms.hrms.dto.request.DepartmentRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/departments")
@Tag(name = "Departments", description = "Department and Organization Management APIs")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping("/getAll")
    @Operation(summary = "List all company departments")
    public ResponseEntity<DataResult<List<DepartmentDto>>> getAll() {
        return ResponseEntity.ok(departmentService.getAll());
    }

    @GetMapping("/getById/{id}")
    @Operation(summary = "Get department by ID")
    public ResponseEntity<DataResult<DepartmentDto>> getById(@PathVariable Integer id) {
        DataResult<DepartmentDto> res = departmentService.getById(id);
        if (!res.getSucces()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @PostMapping("/add")
    @Operation(summary = "Create a new department")
    public ResponseEntity<Result> add(@Valid @RequestBody DepartmentRequest request) {
        Result res = departmentService.add(request);
        if (!res.getSucces()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Update department details")
    public ResponseEntity<Result> update(@PathVariable Integer id, @Valid @RequestBody DepartmentRequest request) {
        Result res = departmentService.update(id, request);
        if (!res.getSucces()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete department")
    public ResponseEntity<Result> delete(@PathVariable Integer id) {
        Result res = departmentService.delete(id);
        if (!res.getSucces()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }
}
