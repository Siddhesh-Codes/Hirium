package hrms.hrms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hrms.hrms.entity.Employee;
import hrms.hrms.security.model.UserRole;

@Repository
public interface EmployeeDao extends JpaRepository<Employee, Integer> {
    Optional<Employee> findByEmail(String email);
    List<Employee> findByDepartmentId(Integer departmentId);
    List<Employee> findByRole(UserRole role);
    List<Employee> findByStatus(String status);
}
