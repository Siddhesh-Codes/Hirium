package hrms.hrms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hrms.hrms.entity.Department;

@Repository
public interface DepartmentDao extends JpaRepository<Department, Integer> {
    Optional<Department> findByName(String name);
    Optional<Department> findByCode(String code);
}
