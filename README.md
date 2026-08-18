# Hirium — Enterprise Talent Operating System & HRMS

<div align="center">

![Java](https://img.shields.io/badge/Java-17%20%7C%2021-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14%20App%20Router-black?style=for-the-badge&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20Serverless-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Security](https://img.shields.io/badge/Security-Dual%20Token%20JWT%20%7C%20BCrypt-red?style=for-the-badge&logo=springsecurity&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-40%2F40%20Passing-brightgreen?style=for-the-badge&logo=junit5&logoColor=white)

**A secure, modern Human Resource Management & Talent Operating System connecting verified employers with qualified professionals.**

[Live Application](https://hirium.vercel.app) • [API Documentation](#api-reference) • [Architecture](#system-architecture) • [Deployment](#live-production-deployment)

</div>

---

## Highlights & Key Features

### Employer Pipeline
- **Job Advertisement Publishing**: Post structured listings with department titles, Indian metropolitan hubs, INR (Rs. / ₹) salary benchmarks, and application deadlines.
- **Dynamic Catalog Quick-Add**: Inline creation of custom Job Positions and City locations directly from the job creation workflow.
- **Candidate Review Modal**: Inspect candidate details, review attached resumes/CVs, and make immediate Approve, Reject, or Pending hiring decisions with live status updates.

### Candidate Experience
- **Public & Authenticated Job Discovery**: Search and filter opportunities by keyword, city, position title, and salary threshold.
- **Streamlined Applications**: Submit job applications with attached resume documents (PDF/DOCX) or portfolio URLs.
- **Real-Time Status Tracking**: Track submitted application states (PENDING, APPROVED, REJECTED) from the personal dashboard.

### Enterprise Security & Architecture
- **Dual-Token JWT Authentication**: Short-lived Access Tokens paired with secure, httpOnly Refresh Token cookies.
- **BCrypt Password Hashing**: Passwords hashed with standard enterprise cryptographic salt rounds.
- **Rate-Limiting Protection**: In-memory token bucket rate limiting on authentication and registration endpoints to prevent brute-force attacks.
- **Role-Based Access Control (RBAC)**: Strict separation between EMPLOYER and JOB_SEEKER authorities.

---

## System Architecture

```
[ Client Browser ]
        |
        v
[ Next.js 14 Frontend ]  ---> (Vercel Edge: https://hirium.vercel.app)
        |
        | HTTPS REST Calls + Dual-Token JWT Auth
        v
[ Spring Boot 3 API ]    ---> (Render Container: https://hirium-backend.onrender.com)
        |
        | SSL Encrypted JDBC Pool (HikariCP)
        v
[ Neon PostgreSQL DB ]   ---> (Neon Serverless Cloud Database)
```

---

## Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, TanStack Query (React Query), React Hook Form, Zod, Lucide Icons |
| **Backend** | Java 17, Spring Boot 3, Spring Data JPA / Hibernate, Spring Security (JWT HS256), Bucket4j Rate Limiting |
| **Database** | PostgreSQL on Neon Serverless with HikariCP Connection Pooling |
| **Testing** | JUnit 5, MockMvc, AssertJ (40 automated unit & integration tests) |
| **DevOps** | Docker, Docker Compose, Vercel, Render |

---

## Live Production Deployment

- **Frontend URL**: [https://hirium.vercel.app](https://hirium.vercel.app)
- **Backend API URL**: [https://hirium-backend.onrender.com](https://hirium-backend.onrender.com)
- **Cloud Database**: Neon Serverless PostgreSQL (ap-southeast-1)

---

## Local Development Setup

### Prerequisites
- **Java 17+** (JDK 17 or higher)
- **Node.js 18+** & **npm**
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Siddhesh-Codes/Hirium.git
cd Hirium
```

### 2. Configure Backend (src/main/resources/application.properties)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hrms_db
spring.datasource.username=postgres
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
cors.allowed-origins=http://localhost:3000
```

### 3. Run Backend Service
```bash
./mvnw spring-boot:run
```
*The Spring Boot API will start on `http://localhost:8080`.*

### 4. Run Frontend Service
```bash
cd frontend
npm install
npm run dev
```
*The Next.js web application will start on `http://localhost:3000`.*

---

## Automated Testing

The backend includes a test suite covering repository constraints, controller serialization, security filters, rate limiting, and dual-token refresh cycles.

```bash
# Run backend test suite
./mvnw test
```

```
[INFO] Results:
[INFO] 
[INFO] Tests run: 40, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] BUILD SUCCESS
```

---

## API Reference

### Authentication (/api/auth)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register/employer` | Public | Register employer organization |
| `POST` | `/api/auth/register/jobseeker` | Public | Register candidate account |
| `POST` | `/api/auth/login` | Public | Authenticate and issue JWT + refresh cookie |
| `POST` | `/api/auth/refresh` | Public | Rotate access token via refresh cookie |
| `POST` | `/api/auth/logout` | Authenticated | Invalidate refresh token session |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user profile |

### Job Advertisements (/api/jobAdvertisements)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobAdvertisements/active` | Public | Get all active job listings |
| `GET` | `/api/jobAdvertisements/getById?id={id}` | Public | Get specific job advertisement details |
| `GET` | `/api/jobAdvertisements/getByEmployer?employerId={id}` | `EMPLOYER` | Get listings published by employer |
| `POST` | `/api/jobAdvertisements/add` | `EMPLOYER` | Publish a new job advertisement |
| `POST` | `/api/jobAdvertisements/toggleStatus?id={id}` | `EMPLOYER` | Toggle active/closed listing status |

### Job Applications (/api/jobApplications)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/jobApplications/apply` | `JOB_SEEKER` | Submit candidate application with resume |
| `GET` | `/api/jobApplications/getByAdvertisement?id={id}` | `EMPLOYER` | Get all candidates for a job listing |
| `GET` | `/api/jobApplications/getByJobSeeker?id={id}` | `JOB_SEEKER` | Get candidate's application history |
| `PATCH` | `/api/jobApplications/updateStatus` | `EMPLOYER` | Update candidate status (`APPROVED`/`REJECTED`) |

### Catalogs (/api/cities & /api/jobpositions)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cities/getAll` | Public | List all available cities |
| `POST` | `/api/cities/add` | Authenticated | Quick-add a new city location |
| `GET` | `/api/jobpositions/getAll` | Authenticated | List all position categories |
| `POST` | `/api/jobpositions/add` | Authenticated | Quick-add a new position title |

---

## Security Policy

Please refer to [SECURITY.md](SECURITY.md) for full details on threat modeling, cryptographic practices, session management, and vulnerability reporting.

---

## License

This project is licensed under the MIT License.
