package hrms.hrms.business.concretes;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import hrms.hrms.business.abstracts.DepartmentService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.ErrorDataResult;
import hrms.hrms.core.utilities.ErrorResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.core.utilities.SuccessDataResult;
import hrms.hrms.core.utilities.SuccessResult;
import hrms.hrms.dto.DepartmentDto;
import hrms.hrms.dto.request.DepartmentRequest;
import hrms.hrms.entity.Department;
import hrms.hrms.repository.DepartmentDao;
import hrms.hrms.repository.EmployeeDao;

@Service
public class DepartmentManager implements DepartmentService {

    private final DepartmentDao departmentDao;
    private final EmployeeDao employeeDao;

    public DepartmentManager(DepartmentDao departmentDao, EmployeeDao employeeDao) {
        this.departmentDao = departmentDao;
        this.employeeDao = employeeDao;
    }

    @Override
    public DataResult<List<DepartmentDto>> getAll() {
        List<DepartmentDto> list = departmentDao.findAll().stream().map(d -> {
            long count = employeeDao.findByDepartmentId(d.getId()).size();
            return new DepartmentDto(d.getId(), d.getName(), d.getCode(), d.getDescription(), d.getManagerName(), count);
        }).toList();
        return new SuccessDataResult<>(list, "Departments listed successfully.");
    }

    @Override
    public DataResult<DepartmentDto> getById(Integer id) {
        Optional<Department> opt = departmentDao.findById(id);
        if (opt.isEmpty()) {
            return new ErrorDataResult<>("Department not found with ID: " + id);
        }
        Department d = opt.get();
        long count = employeeDao.findByDepartmentId(d.getId()).size();
        DepartmentDto dto = new DepartmentDto(d.getId(), d.getName(), d.getCode(), d.getDescription(), d.getManagerName(), count);
        return new SuccessDataResult<>(dto, "Department retrieved.");
    }

    @Override
    public Result add(DepartmentRequest request) {
        if (departmentDao.findByName(request.getName()).isPresent()) {
            return new ErrorResult("Department with this name already exists.");
        }
        if (departmentDao.findByCode(request.getCode()).isPresent()) {
            return new ErrorResult("Department with this code already exists.");
        }

        Department d = new Department();
        d.setName(request.getName());
        d.setCode(request.getCode());
        d.setDescription(request.getDescription());
        d.setManagerName(request.getManagerName());
        departmentDao.save(d);

        return new SuccessResult("Department created successfully.");
    }

    @Override
    public Result update(Integer id, DepartmentRequest request) {
        Optional<Department> opt = departmentDao.findById(id);
        if (opt.isEmpty()) {
            return new ErrorResult("Department not found with ID: " + id);
        }

        Department d = opt.get();
        d.setName(request.getName());
        d.setCode(request.getCode());
        d.setDescription(request.getDescription());
        d.setManagerName(request.getManagerName());
        departmentDao.save(d);

        return new SuccessResult("Department updated successfully.");
    }

    @Override
    public Result delete(Integer id) {
        if (!departmentDao.existsById(id)) {
            return new ErrorResult("Department not found with ID: " + id);
        }
        departmentDao.deleteById(id);
        return new SuccessResult("Department deleted successfully.");
    }
}
