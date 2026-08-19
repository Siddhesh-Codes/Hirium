package hrms.hrms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hrms.hrms.entity.LeaveRequest;

@Repository
public interface LeaveRequestDao extends JpaRepository<LeaveRequest, Integer> {
    List<LeaveRequest> findByEmployeeIdOrderByAppliedAtDesc(Integer employeeId);
    List<LeaveRequest> findByStatusOrderByAppliedAtDesc(String status);
    List<LeaveRequest> findAllByOrderByAppliedAtDesc();
}
