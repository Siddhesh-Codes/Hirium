package hrms.hrms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hrms.hrms.entity.Payroll;

@Repository
public interface PayrollDao extends JpaRepository<Payroll, Integer> {
    Optional<Payroll> findByEmployeeIdAndMonthAndYear(Integer employeeId, Integer month, Integer year);
    List<Payroll> findByEmployeeIdOrderByYearDescMonthDesc(Integer employeeId);
    List<Payroll> findByMonthAndYear(Integer month, Integer year);
    List<Payroll> findAllByOrderByYearDescMonthDesc();
}
