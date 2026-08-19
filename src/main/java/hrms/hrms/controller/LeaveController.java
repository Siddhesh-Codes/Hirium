package hrms.hrms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hrms.hrms.business.abstracts.LeaveService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.LeaveRequestDto;
import hrms.hrms.dto.request.LeaveApplyRequest;
import hrms.hrms.dto.request.LeaveReviewRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/leaves")
@Tag(name = "Leaves", description = "Leave Application & Approval Workflow APIs")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping("/apply")
    @Operation(summary = "Employee submits a leave application")
    public ResponseEntity<Result> apply(@Valid @RequestBody LeaveApplyRequest request) {
        Result res = leaveService.apply(request);
        if (!res.getSucces()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}/review")
    @Operation(summary = "HR/Admin approves or rejects a leave request")
    public ResponseEntity<Result> review(@PathVariable Integer id, @Valid @RequestBody LeaveReviewRequest request) {
        Result res = leaveService.review(id, request);
        if (!res.getSucces()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get leave applications for a specific employee")
    public ResponseEntity<DataResult<List<LeaveRequestDto>>> getEmployeeLeaves(@PathVariable Integer employeeId) {
        return ResponseEntity.ok(leaveService.getEmployeeLeaves(employeeId));
    }

    @GetMapping("/pending")
    @Operation(summary = "HR/Admin view all pending leave requests")
    public ResponseEntity<DataResult<List<LeaveRequestDto>>> getPending() {
        return ResponseEntity.ok(leaveService.getPendingLeaves());
    }

    @GetMapping("/getAll")
    @Operation(summary = "List all company leave requests")
    public ResponseEntity<DataResult<List<LeaveRequestDto>>> getAll() {
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }
}
