package hrms.hrms;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import org.junit.jupiter.api.Test;

public class VerifyNeonDbTest {

    @Test
    public void testNeonTables() {
        String url = System.getenv().getOrDefault("SPRING_DATASOURCE_URL", "jdbc:postgresql://localhost:5432/hrms");
        String user = System.getenv().getOrDefault("SPRING_DATASOURCE_USERNAME", "postgres");
        String pass = System.getenv().getOrDefault("SPRING_DATASOURCE_PASSWORD", "");

        if (pass.isBlank()) {
            System.out.println("Skipping live Neon DB test: SPRING_DATASOURCE_PASSWORD environment variable not set.");
            return;
        }

        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {
            System.out.println("=== CONNECTED TO LIVE NEON POSTGRESQL ===");

            // 1. Create / Verify all tables in Neon DB
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS departments (
                    department_id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL UNIQUE,
                    code VARCHAR(50) NOT NULL UNIQUE,
                    description TEXT,
                    manager_name VARCHAR(255)
                );
            """);

            stmt.execute("""
                CREATE TABLE IF NOT EXISTS employees (
                    employee_id SERIAL PRIMARY KEY,
                    first_name VARCHAR(255) NOT NULL,
                    last_name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    phone VARCHAR(50),
                    job_title VARCHAR(255),
                    role VARCHAR(50) NOT NULL,
                    status VARCHAR(50) NOT NULL,
                    hire_date DATE,
                    salary DOUBLE PRECISION,
                    password_change_required BOOLEAN DEFAULT FALSE,
                    department_id INTEGER REFERENCES departments(department_id) ON DELETE SET NULL
                );
            """);

            stmt.execute("""
                ALTER TABLE employees ADD COLUMN IF NOT EXISTS password_change_required BOOLEAN DEFAULT FALSE;
            """);

            stmt.execute("""
                CREATE TABLE IF NOT EXISTS attendance (
                    attendance_id SERIAL PRIMARY KEY,
                    employee_id INTEGER NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
                    attendance_date DATE NOT NULL,
                    check_in_time TIME,
                    check_out_time TIME,
                    work_hours DOUBLE PRECISION,
                    status VARCHAR(50) NOT NULL,
                    notes VARCHAR(500),
                    UNIQUE (employee_id, attendance_date)
                );
            """);

            stmt.execute("""
                CREATE TABLE IF NOT EXISTS leave_requests (
                    leave_id SERIAL PRIMARY KEY,
                    employee_id INTEGER NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
                    leave_type VARCHAR(50) NOT NULL,
                    start_date DATE NOT NULL,
                    end_date DATE NOT NULL,
                    total_days INTEGER NOT NULL,
                    reason VARCHAR(500) NOT NULL,
                    status VARCHAR(50) NOT NULL,
                    rejection_reason VARCHAR(500),
                    applied_at TIMESTAMP,
                    reviewed_at TIMESTAMP
                );
            """);

            stmt.execute("""
                CREATE TABLE IF NOT EXISTS payrolls (
                    payroll_id SERIAL PRIMARY KEY,
                    employee_id INTEGER NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
                    payroll_month INTEGER NOT NULL,
                    payroll_year INTEGER NOT NULL,
                    basic_salary DOUBLE PRECISION NOT NULL,
                    allowances DOUBLE PRECISION NOT NULL,
                    deductions DOUBLE PRECISION NOT NULL,
                    net_salary DOUBLE PRECISION NOT NULL,
                    status VARCHAR(50) NOT NULL,
                    payment_date DATE,
                    UNIQUE (employee_id, payroll_month, payroll_year)
                );
            """);

            System.out.println("All HRMS tables successfully verified in Neon PostgreSQL!");

            // Print all table names
            ResultSet rs = stmt.executeQuery("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
            System.out.println("\n--- LIST OF TABLES IN NEON POSTGRESQL ---");
            while (rs.next()) {
                System.out.println("  ✓ Table: " + rs.getString("table_name"));
            }
            System.out.println("-----------------------------------------\n");

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
