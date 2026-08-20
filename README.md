# Hirium — Enterprise Talent Operating System & HRMS

<div align="center">

![Java](https://img.shields.io/badge/Java-17%20%7C%2021-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14%20App%20Router-black?style=for-the-badge&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20Serverless-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Security](https://img.shields.io/badge/Security-Strict%20RBAC%20%7C%20BCrypt%20%7C%20JWT-red?style=for-the-badge&logo=springsecurity&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-47%2F47%20Passing-brightgreen?style=for-the-badge&logo=junit5&logoColor=white)

**A full-stack, enterprise-grade Human Resource Management System (HRMS) & Talent Operating System featuring automated payroll, employee lifecycle management, attendance tracking, leave approval workflows, public recruitment pipeline, and automated email onboarding.**

[Live Application](https://hirium.vercel.app) • [API Documentation](#api-reference) • [System Architecture](#system-architecture) • [Security & Validation](#enterprise-security--validation) • [Deployment](#live-production-deployment)

</div>

---

## Core Modules & Capabilities

### 1. Employee Directory & Lifecycle Management
- **Centralized Staff Registry**: Full CRUD operations for employees with searchable department, role, salary, and designation filtering.
- **Automated Onboarding Engine**: One-click onboarding with auto-generated secure credentials.
- **Automated Email Dispatch**: Sends an official welcome letter via Gmail SMTP containing login details and temporary credentials.
- **Mandatory First-Login Password Change**: Forces new employees to set their own private password upon initial login.
- **In-App Confirmation Modals**: Modern dialogs for destructive actions without relying on native browser alerts.

### 2. Department Architecture
- **Organizational Structuring**: Create and manage organizational departments with custom codes (`ENG`, `HR`, `FIN`, `MKT`).
- **Department Leadership**: Assign designated department heads and track real-time active headcount.

### 3. Attendance & Time Tracking
- **Smart Shift Punch Clock**: Real-time punch-in / punch-out mechanism with daily duration calculation.
- **Overtime & Anomaly Detection**: Tracks total working hours and flags deviations.
- **Enterprise Attendance Logs**: Date-filtered audit logs across all company staff.

### 4. Leave Management & Approval Engine
- **Multi-Category Leave Quotas**: Supports Annual, Sick, and Casual leave allocations.
- **Role-Based Workflow**: Employees submit requests with reason notes; HR & Admins review, approve, or reject with real-time balance deductions.

### 5. Payroll Processing & Payslip Engine
- **Automated Batch Processing**: Calculates monthly payouts based on `Basic Salary + Allowances (15%) - Statutory Deductions (10%) = Net Payable`.
- **Payment Lifecycle**: Track `PROCESSED` vs `PAID` statuses with disbursement dates.
- **Printable Payslips**: Formal company-branded salary slips with detailed earnings/deductions breakdown and print capability.

### 6. Recruitment & Talent Acquisition
- **Public Job Board**: Search and filter active job openings with INR (Rs. / INR) salary benchmarks and deadlines.
- **Direct Candidate Applications**: Public applicants submit applications without requiring employee portal accounts.
- **Secure Resume Storage**: Candidate resume documents (PDF/DOCX) stored in the cloud with instant in-browser preview.
- **Multi-Company Pipeline Isolation**: Strict tenant scoping ensuring companies only view their own candidate pipelines.
- **Candidate Pipeline Tracking**: Review applicants and transition statuses (`PENDING`, `SHORTLISTED`, `HIRED`, `REJECTED`).

---

## Enterprise Security & Validation

- **Strict Mobile Number Validation**:
  - Rejects dummy numbers (e.g. `1234567890`, `0123456789`, `9876543210`).
  - Rejects repeated single-digit numbers (e.g. `0000000000`, `1111111111`, `9999999999`).
  - Enforces genuine 10-digit mobile numbers starting with digits `6, 7, 8, or 9`, optional `+91` prefix, or international E.164 formats.
- **Enterprise Password Security Policy**:
  - Minimum **8 characters** with mandatory uppercase, lowercase, numeric, and special character requirements.
  - Interactive **Live Password Strength Meter** with color-coded progression bar.
- **Dual-Token JWT & Tolerant Sessions**:
  - Stateless HS256 JWT authentication with secure session persistence across browser refreshes.
- **Role-Based Access Control (RBAC)**:
  - `ADMIN` / `HR` / `EMPLOYER`: Full administrative access to Employees, Departments, Payroll, and Recruitment.
  - `EMPLOYEE`: Access strictly limited to Overview, Attendance, Leaves, and Salary Payslips.

---

## System Architecture

```
[ Public Visitors & Candidates ]       [ Authenticated Employees / HR / Admins ]
              │                                           │
              └─────────────────────┬─────────────────────┘
                                    ▼
                         [ Next.js 14 Frontend ]
                       (Vercel Edge: hirium.vercel.app)
                                    │
                                    │ HTTPS + Bearer JWT
                                    ▼
                         [ Spring Boot 3 API ]
                    (Render: hirium-backend.onrender.com)
                                    │
                  ┌─────────────────┼─────────────────┐
                  ▼                 ▼                 ▼
          [ Neon PostgreSQL ] [ Gmail SMTP ]  [ Resume Storage ]
          (Serverless DB)     (Onboarding)    (Cloud Storage)
```

---

## Technology Stack

| Layer | Technologies & Frameworks |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, TanStack Query (React Query), React Hook Form, Zod, Lucide Icons, Zustand |
| **Backend** | Java 17, Spring Boot 3, Spring Data JPA / Hibernate, Spring Security (JWT HS256), JavaMailSender, HikariCP |
| **Database** | PostgreSQL on Neon Serverless with connection pooling |
| **Cloud & Media** | Cloud Document Storage (Resume and attachments), Gmail SMTP (Transactional emails) |
| **Testing** | JUnit 5, MockMvc, AssertJ (**47 automated unit & integration tests**) |
| **DevOps** | Docker, Multi-Stage Containerization, Vercel, Render |

---

## Live Production Deployment

- **Frontend URL**: [https://hirium.vercel.app](https://hirium.vercel.app)
- **Backend API URL**: [https://hirium-backend.onrender.com](https://hirium-backend.onrender.com)
- **Database**: Neon Serverless PostgreSQL (`ap-southeast-1`)

---

## Local Development Setup

### Prerequisites
- **Java 17+** (JDK 17 or 21)
- **Node.js 18+** & **npm**
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Siddhesh-Codes/Hirium.git
cd Hirium
```

### 2. Configure Backend (`src/main/resources/application.properties`)
```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/hrms_db
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
cors.allowed-origins=http://localhost:3000,https://hirium.vercel.app
```

### 3. Run Backend Service
```bash
./mvnw spring-boot:run
```
*Backend API will run on `http://localhost:8080`.*

### 4. Run Frontend Service
```bash
cd frontend
npm install
npm run dev
```
*Frontend will run on `http://localhost:3000`.*

---

## Automated Testing

The backend includes a comprehensive test suite covering all HRMS business logic, authentication, recruitment, payroll calculations, and security authorization.

```bash
# Run the full test suite
./mvnw test
```

```
[INFO] Results:
[INFO] 
[INFO] Tests run: 47, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] BUILD SUCCESS
```

---

## API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register/employer` | Public | Register new organization with security validation |
| `POST` | `/api/auth/register/jobseeker` | Public | Register candidate profile |
| `POST` | `/api/auth/login` | Public | Authenticate user and issue JWT |
| `POST` | `/api/auth/refresh` | Public | Refresh expired access token |
| `POST` | `/api/auth/logout` | Authenticated | Terminate session |
| `GET` | `/api/auth/me` | Authenticated | Get profile of logged-in user |

### Employee Directory (`/api/employees`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/employees/getAll` | `HR`, `ADMIN`, `EMPLOYER` | Retrieve full employee list |
| `GET` | `/api/employees/getById/{id}` | Authenticated | Get employee profile details |
| `POST` | `/api/employees/add` | `HR`, `ADMIN`, `EMPLOYER` | Add employee & dispatch welcome email |
| `PUT` | `/api/employees/update/{id}` | `HR`, `ADMIN`, `EMPLOYER` | Update employee profile |
| `DELETE` | `/api/employees/delete/{id}` | `HR`, `ADMIN`, `EMPLOYER` | Remove employee and associated records |
| `POST` | `/api/employees/change-password` | Authenticated | Change user account password |

### Departments (`/api/departments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/departments/getAll` | Authenticated | List all departments with headcount |
| `POST` | `/api/departments/add` | `HR`, `ADMIN`, `EMPLOYER` | Create new department |
| `PUT` | `/api/departments/update/{id}` | `HR`, `ADMIN`, `EMPLOYER` | Update department details |
| `DELETE` | `/api/departments/delete/{id}` | `HR`, `ADMIN`, `EMPLOYER` | Delete department |

### Attendance (`/api/attendance`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/attendance/check-in` | `EMPLOYEE` | Clock in for daily shift |
| `POST` | `/api/attendance/check-out` | `EMPLOYEE` | Clock out and calculate shift duration |
| `GET` | `/api/attendance/employee/{id}` | Authenticated | Get employee attendance history |
| `GET` | `/api/attendance/today` | `HR`, `ADMIN`, `EMPLOYER` | View today's organizational attendance |

### Leave Management (`/api/leaves`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/leaves/apply` | `EMPLOYEE` | Submit leave application |
| `POST` | `/api/leaves/review` | `HR`, `ADMIN`, `EMPLOYER` | Approve or reject leave request |
| `GET` | `/api/leaves/employee/{id}` | Authenticated | Get employee leave history & balances |
| `GET` | `/api/leaves/pending` | `HR`, `ADMIN`, `EMPLOYER` | View pending leave applications |

### Payroll Engine (`/api/payroll`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payroll/generate` | `HR`, `ADMIN`, `EMPLOYER` | Run monthly salary calculation batch |
| `GET` | `/api/payroll/getAll` | `HR`, `ADMIN`, `EMPLOYER` | View all processed payroll records |
| `GET` | `/api/payroll/employee/{id}` | Authenticated | Get employee salary payslips |
| `PUT` | `/api/payroll/{id}/mark-paid` | `HR`, `ADMIN`, `EMPLOYER` | Mark payroll record as paid |

### Recruitment & Talent Acquisition (`/api/jobAdvertisements` & `/api/applications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobAdvertisements/getAll` | Public | List all active job vacancies |
| `POST` | `/api/jobAdvertisements/add` | `HR`, `ADMIN`, `EMPLOYER` | Post a new job opening |
| `POST` | `/api/applications/apply` | Public | Submit candidate job application with resume |
| `GET` | `/api/applications/by-advertisement/{id}` | `HR`, `ADMIN`, `EMPLOYER` | Get candidate applications for a job |
| `POST` | `/api/applications/update-status` | `HR`, `ADMIN`, `EMPLOYER` | Update candidate status (`HIRED`, `REJECTED`) |

---

## License

This project is licensed under the MIT License.
