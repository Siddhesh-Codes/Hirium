package hrms.hrms.business.abstracts;

import java.util.List;

import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.DepartmentDto;
import hrms.hrms.dto.request.DepartmentRequest;

public interface DepartmentService {
    DataResult<List<DepartmentDto>> getAll();
    DataResult<DepartmentDto> getById(Integer id);
    Result add(DepartmentRequest request);
    Result update(Integer id, DepartmentRequest request);
    Result delete(Integer id);
}
