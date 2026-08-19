package hrms.hrms.business.abstracts;

import java.time.LocalDate;
import java.util.List;

import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.AttendanceDto;
import hrms.hrms.dto.request.AttendanceCheckInRequest;
import hrms.hrms.dto.request.AttendanceCheckOutRequest;

public interface AttendanceService {
    Result checkIn(AttendanceCheckInRequest request);
    Result checkOut(AttendanceCheckOutRequest request);
    DataResult<AttendanceDto> getTodayAttendance(Integer employeeId);
    DataResult<List<AttendanceDto>> getEmployeeHistory(Integer employeeId);
    DataResult<List<AttendanceDto>> getDailyOverview(LocalDate date);
}
