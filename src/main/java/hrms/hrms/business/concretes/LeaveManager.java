package hrms.hrms.business.concretes;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import hrms.hrms.business.abstracts.LeaveService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.ErrorResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.core.utilities.SuccessDataResult;
import hrms.hrms.core.utilities.SuccessResult;
import hrms.hrms.dto.LeaveRequestDto;
import hrms.hrms.dto.request.LeaveApplyRequest;
import hrms.hrms.dto.request.LeaveReviewRequest;
import hrms.hrms.entity.Employee;
import hrms.hrms.entity.LeaveRequest;
import hrms.hrms.repository.EmployeeDao;
import hrms.hrms.repository.LeaveRequestDao;

@Service
public class LeaveManager implements LeaveService {

    private final LeaveRequestDao leaveRequestDao;
    private final EmployeeDao employeeDao;

    public LeaveManager(LeaveRequestDao leaveRequestDao, EmployeeDao employeeDao) {
        this.leaveRequestDao = leaveRequestDao;
        this.employeeDao = employeeDao;
    }

    private LeaveRequestDto toDto(LeaveRequest l) {
        String deptName = l.getEmployee().getDepartment() != null ? l.getEmployee().getDepartment().getName() : "General";
        return new LeaveRequestDto(
                l.getId(),
                l.getEmployee().getId(),
                l.getEmployee().getFirstName() + " " + l.getEmployee().getLastName(),
                l.getEmployee().getEmail(),
                deptName,
                l.getLeaveType(),
                l.getStartDate(),
                l.getEndDate(),
                l.getTotalDays(),
                l.getReason(),
                l.getStatus(),
                l.getRejectionReason(),
                l.getAppliedAt(),
                l.getReviewedAt()
        );
    }

    @Override
    public Result apply(LeaveApplyRequest request) {
        Optional<Employee> empOpt = employeeDao.findById(request.getEmployeeId());
        if (empOpt.isEmpty()) {
            return new ErrorResult("Employee not found with ID: " + request.getEmployeeId());
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            return new ErrorResult("Leave end date cannot be earlier than start date.");
        }

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;

        LeaveRequest leave = new LeaveRequest();
        leave.setEmployee(empOpt.get());
        leave.setLeaveType(request.getLeaveType());
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setTotalDays((int) days);
        leave.setReason(request.getReason());
        leave.setStatus("PENDING");
        leave.setAppliedAt(LocalDateTime.now());

        leaveRequestDao.save(leave);
        return new SuccessResult("Leave request submitted successfully (" + days + " days).");
    }

    @Override
    public Result review(Integer leaveId, LeaveReviewRequest request) {
        Optional<LeaveRequest> opt = leaveRequestDao.findById(leaveId);
        if (opt.isEmpty()) {
            return new ErrorResult("Leave request not found with ID: " + leaveId);
        }

        String newStatus = request.getStatus().toUpperCase();
        if (!"APPROVED".equals(newStatus) && !"REJECTED".equals(newStatus)) {
            return new ErrorResult("Invalid status. Must be APPROVED or REJECTED.");
        }

        LeaveRequest leave = opt.get();
        leave.setStatus(newStatus);
        leave.setRejectionReason(request.getRejectionReason());
        leave.setReviewedAt(LocalDateTime.now());

        leaveRequestDao.save(leave);
        return new SuccessResult("Leave request #" + leaveId + " marked as " + newStatus + ".");
    }

    @Override
    public DataResult<List<LeaveRequestDto>> getEmployeeLeaves(Integer employeeId) {
        List<LeaveRequestDto> list = leaveRequestDao.findByEmployeeIdOrderByAppliedAtDesc(employeeId).stream().map(this::toDto).toList();
        return new SuccessDataResult<>(list, "Employee leaves retrieved.");
    }

    @Override
    public DataResult<List<LeaveRequestDto>> getPendingLeaves() {
        List<LeaveRequestDto> list = leaveRequestDao.findByStatusOrderByAppliedAtDesc("PENDING").stream().map(this::toDto).toList();
        return new SuccessDataResult<>(list, "Pending leave requests retrieved.");
    }

    @Override
    public DataResult<List<LeaveRequestDto>> getAllLeaves() {
        List<LeaveRequestDto> list = leaveRequestDao.findAllByOrderByAppliedAtDesc().stream().map(this::toDto).toList();
        return new SuccessDataResult<>(list, "All leave requests retrieved.");
    }
}
