package hrms.hrms.business.concretes;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import hrms.hrms.business.abstracts.AttendanceService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.ErrorDataResult;
import hrms.hrms.core.utilities.ErrorResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.core.utilities.SuccessDataResult;
import hrms.hrms.core.utilities.SuccessResult;
import hrms.hrms.dto.AttendanceDto;
import hrms.hrms.dto.request.AttendanceCheckInRequest;
import hrms.hrms.dto.request.AttendanceCheckOutRequest;
import hrms.hrms.entity.Attendance;
import hrms.hrms.entity.Employee;
import hrms.hrms.repository.AttendanceDao;
import hrms.hrms.repository.EmployeeDao;

@Service
public class AttendanceManager implements AttendanceService {

    private final AttendanceDao attendanceDao;
    private final EmployeeDao employeeDao;

    public AttendanceManager(AttendanceDao attendanceDao, EmployeeDao employeeDao) {
        this.attendanceDao = attendanceDao;
        this.employeeDao = employeeDao;
    }

    private AttendanceDto toDto(Attendance a) {
        String deptName = a.getEmployee().getDepartment() != null ? a.getEmployee().getDepartment().getName() : "General";
        return new AttendanceDto(
                a.getId(),
                a.getEmployee().getId(),
                a.getEmployee().getFirstName() + " " + a.getEmployee().getLastName(),
                a.getEmployee().getEmail(),
                deptName,
                a.getAttendanceDate(),
                a.getCheckInTime(),
                a.getCheckOutTime(),
                a.getWorkHours(),
                a.getStatus(),
                a.getNotes()
        );
    }

    @Override
    public Result checkIn(AttendanceCheckInRequest request) {
        Optional<Employee> empOpt = employeeDao.findById(request.getEmployeeId());
        if (empOpt.isEmpty()) {
            return new ErrorResult("Employee not found with ID: " + request.getEmployeeId());
        }

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        Optional<Attendance> existing = attendanceDao.findByEmployeeIdAndAttendanceDate(request.getEmployeeId(), today);
        if (existing.isPresent()) {
            return new ErrorResult("Attendance already checked in for today at " + existing.get().getCheckInTime().toString().substring(0, 5));
        }

        // Determine if late (e.g. after 09:30 AM)
        String status = now.isAfter(LocalTime.of(9, 30)) ? "LATE" : "PRESENT";

        Attendance attendance = new Attendance();
        attendance.setEmployee(empOpt.get());
        attendance.setAttendanceDate(today);
        attendance.setCheckInTime(now);
        attendance.setStatus(status);
        attendance.setNotes(request.getNotes());

        attendanceDao.save(attendance);
        return new SuccessResult("Checked in successfully at " + now.toString().substring(0, 5) + " (" + status + ").");
    }

    @Override
    public Result checkOut(AttendanceCheckOutRequest request) {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        Optional<Attendance> opt = attendanceDao.findByEmployeeIdAndAttendanceDate(request.getEmployeeId(), today);
        if (opt.isEmpty()) {
            return new ErrorResult("No check-in record found for today. Please check in first.");
        }

        Attendance attendance = opt.get();
        if (attendance.getCheckOutTime() != null) {
            return new ErrorResult("Already checked out today at " + attendance.getCheckOutTime().toString().substring(0, 5));
        }

        attendance.setCheckOutTime(now);

        // Compute work hours
        Duration duration = Duration.between(attendance.getCheckInTime(), now);
        double hours = duration.toMinutes() / 60.0;
        double roundedHours = Math.round(hours * 100.0) / 100.0;
        attendance.setWorkHours(roundedHours);

        if (roundedHours < 4.0 && !"LATE".equals(attendance.getStatus())) {
            attendance.setStatus("HALF_DAY");
        }

        if (request.getNotes() != null && !request.getNotes().isBlank()) {
            attendance.setNotes(attendance.getNotes() != null ? attendance.getNotes() + " | " + request.getNotes() : request.getNotes());
        }

        attendanceDao.save(attendance);
        return new SuccessResult("Checked out successfully at " + now.toString().substring(0, 5) + " (Total: " + roundedHours + " hrs).");
    }

    @Override
    public DataResult<AttendanceDto> getTodayAttendance(Integer employeeId) {
        LocalDate today = LocalDate.now();
        Optional<Attendance> opt = attendanceDao.findByEmployeeIdAndAttendanceDate(employeeId, today);
        if (opt.isEmpty()) {
            return new ErrorDataResult<>("Not checked in today.");
        }
        return new SuccessDataResult<>(toDto(opt.get()), "Today's attendance record retrieved.");
    }

    @Override
    public DataResult<List<AttendanceDto>> getEmployeeHistory(Integer employeeId) {
        List<AttendanceDto> list = attendanceDao.findByEmployeeIdOrderByAttendanceDateDesc(employeeId).stream().map(this::toDto).toList();
        return new SuccessDataResult<>(list, "Employee attendance history retrieved.");
    }

    @Override
    public DataResult<List<AttendanceDto>> getDailyOverview(LocalDate date) {
        LocalDate target = date != null ? date : LocalDate.now();
        List<AttendanceDto> list = attendanceDao.findByAttendanceDate(target).stream().map(this::toDto).toList();
        return new SuccessDataResult<>(list, "Daily attendance overview retrieved for " + target);
    }
}
