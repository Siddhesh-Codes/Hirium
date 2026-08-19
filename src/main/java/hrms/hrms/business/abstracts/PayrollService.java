package hrms.hrms.business.abstracts;

import java.util.List;

import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.Result;
import hrms.hrms.dto.PayrollDto;
import hrms.hrms.dto.request.PayrollGenerateRequest;

public interface PayrollService {
    Result generateMonthlyPayroll(PayrollGenerateRequest request);
    DataResult<List<PayrollDto>> getByPeriod(Integer month, Integer year);
    DataResult<List<PayrollDto>> getEmployeePayslips(Integer employeeId);
    DataResult<PayrollDto> getById(Integer id);
    Result markAsPaid(Integer payrollId);
    DataResult<List<PayrollDto>> getAll();
}
