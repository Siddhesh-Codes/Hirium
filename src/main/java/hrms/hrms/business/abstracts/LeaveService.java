package hrms.hrms.business.abstracts;

import java.util.List;

import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.LeaveRequestDto;
import hrms.hrms.dto.request.LeaveApplyRequest;
import hrms.hrms.dto.request.LeaveReviewRequest;

public interface LeaveService {
    Result apply(LeaveApplyRequest request);
    Result review(Integer leaveId, LeaveReviewRequest request);
    DataResult<List<LeaveRequestDto>> getEmployeeLeaves(Integer employeeId);
    DataResult<List<LeaveRequestDto>> getPendingLeaves();
    DataResult<List<LeaveRequestDto>> getAllLeaves();
}
