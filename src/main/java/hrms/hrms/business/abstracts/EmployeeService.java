package hrms.hrms.business.abstracts;

import java.util.List;

import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.EmployeeDto;
import hrms.hrms.dto.request.EmployeeRequest;

public interface EmployeeService {
    DataResult<List<EmployeeDto>> getAll();
    DataResult<EmployeeDto> getById(Integer id);
    DataResult<EmployeeDto> getByEmail(String email);
    DataResult<List<EmployeeDto>> getByDepartment(Integer departmentId);
    Result add(EmployeeRequest request);
    Result update(Integer id, EmployeeRequest request);
    Result delete(Integer id);
    Result changePassword(Integer id, String oldPassword, String newPassword);
}
