package hrms.hrms.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hrms.hrms.business.abstracts.AttendanceService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.AttendanceDto;
import hrms.hrms.dto.request.AttendanceCheckInRequest;
import hrms.hrms.dto.request.AttendanceCheckOutRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/attendance")
@Tag(name = "Attendance", description = "Attendance Tracking & Punch Clock APIs")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/check-in")
    @Operation(summary = "Employee punch-in for work")
    public ResponseEntity<Result> checkIn(@Valid @RequestBody AttendanceCheckInRequest request) {
        Result res = attendanceService.checkIn(request);
        if (!res.getSucces()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @PostMapping("/check-out")
    @Operation(summary = "Employee punch-out and work hours calculation")
    public ResponseEntity<Result> checkOut(@Valid @RequestBody AttendanceCheckOutRequest request) {
        Result res = attendanceService.checkOut(request);
        if (!res.getSucces()) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok(res);
    }

    @GetMapping("/today/{employeeId}")
    @Operation(summary = "Get today's punch-in status for an employee")
    public ResponseEntity<DataResult<AttendanceDto>> getToday(@PathVariable Integer employeeId) {
        return ResponseEntity.ok(attendanceService.getTodayAttendance(employeeId));
    }

    @GetMapping("/history/{employeeId}")
    @Operation(summary = "Get full attendance log for an employee")
    public ResponseEntity<DataResult<List<AttendanceDto>>> getHistory(@PathVariable Integer employeeId) {
        return ResponseEntity.ok(attendanceService.getEmployeeHistory(employeeId));
    }

    @GetMapping("/daily-overview")
    @Operation(summary = "HR/Admin daily attendance overview across the organization")
    public ResponseEntity<DataResult<List<AttendanceDto>>> getDailyOverview(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(attendanceService.getDailyOverview(date));
    }
}
