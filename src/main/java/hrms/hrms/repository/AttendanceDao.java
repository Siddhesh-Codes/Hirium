package hrms.hrms.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hrms.hrms.entity.Attendance;

@Repository
public interface AttendanceDao extends JpaRepository<Attendance, Integer> {
    Optional<Attendance> findByEmployeeIdAndAttendanceDate(Integer employeeId, LocalDate attendanceDate);
    List<Attendance> findByEmployeeIdOrderByAttendanceDateDesc(Integer employeeId);
    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);
    List<Attendance> findByAttendanceDateBetween(LocalDate startDate, LocalDate endDate);
}
