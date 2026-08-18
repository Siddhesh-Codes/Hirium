# HRMS Security Architecture & API Specification

This document details the security architecture, token strategies, JWT claims, role-based access control matrix, and rate limiting implemented for the **HMRS REST API**.

---

## 1. Overview & Authentication Model

The HRMS application uses a unified stateless JWT authentication and authorization model built on **Spring Boot 3** and **Spring Security 6**.
- **Entities**: Employers and Job Seekers are stored as distinct entities with unified `UserDetails` mapping (`CustomUserDetails`).
- **User Roles**:
  - `EMPLOYER`: Companies and recruiters managing job postings and reviewing applicant candidates.
  - `JOB_SEEKER`: Candidates browsing positions and submitting job applications.
  - `ADMIN`: System administrators.
- **Password Security**: All user passwords are encrypted using `BCryptPasswordEncoder`. Plaintext passwords are never logged, persisted, or returned in DTO responses (`@JsonIgnore` and filtered DTO mappings).

---

## 2. Token Strategy

| Parameter | Access Token | Refresh Token |
| :--- | :--- | :--- |
| **Lifetime** | 15 Minutes (`900,000 ms`) | 7 Days (`604,800,000 ms`) |
| **Storage (Frontend)** | In-memory React State / Zustand | `httpOnly`, `SameSite=Strict`, `Secure` Cookie |
| **Algorithm** | HMAC-SHA256 (`HS256`) | HMAC-SHA256 (`HS256`) |
| **Transmission** | `Authorization: Bearer <token>` | Automatic via browser Cookie (`refreshToken`) |
| **Rotation / Revocation** | Ephemeral, expires naturally | Single-use rotation; blacklisted upon logout / refresh |

### Cookie Settings for Refresh Token
- `Name`: `refreshToken`
- `HttpOnly`: `true` (prevents JavaScript access & XSS token exfiltration)
- `SameSite`: `Strict` (mitigates CSRF vulnerabilities)
- `Path`: `/`
- `Secure`: `false` in local development (`true` in TLS production)
- `Max-Age`: `604800` seconds

---

## 3. JWT Claims Structure

### Access Token Payload
```json
{
  "sub": "12",
  "userId": 12,
  "email": "recruiter@acme.com",
  "role": "EMPLOYER",
  "name": "Acme Technologies",
  "iat": 1723960000,
  "exp": 1723960900
}
```

### Refresh Token Payload
```json
{
  "sub": "12",
  "userId": 12,
  "email": "recruiter@acme.com",
  "role": "EMPLOYER",
  "iat": 1723960000,
  "exp": 1724564800
}
```

---

## 4. Endpoint Role Matrix & Permissions

| Method | Endpoint Path | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register/employer` | **Public** | Register a new employer |
| `POST` | `/api/auth/register/job-seeker` | **Public** | Register a new candidate |
| `POST` | `/api/auth/login` | **Public** | Authenticate credentials & issue tokens |
| `POST` | `/api/auth/refresh` | **Public** | Rotate refresh token & issue new access token |
| `POST` | `/api/auth/logout` | **Public** | Invalidate refresh token & clear cookie |
| `GET` | `/api/auth/me` | **Authenticated** | Fetch currently authenticated user profile |
| `GET` | `/api/cities/**` | **Public** | List cities |
| `GET` | `/api/jobPosition/**` | **Public** | List job positions / titles |
| `GET` | `/api/jobPost/**` / `/api/jobAdvertisements/**` | **Public** | Browse active public job postings |
| `GET` | `/api/jobPost/{id}` | **Public** | View specific job advertisement detail |
| `POST` | `/api/jobPost/add` | `EMPLOYER` | Create a new job advertisement |
| `POST` | `/api/applications/update-status` | `EMPLOYER` | Update candidate application status |
| `GET` | `/api/applications/by-advertisement/{id}` | `EMPLOYER` | View all applicants for a posting |
| `GET` | `/api/jobPost/active/by-employer` | `EMPLOYER` | View active postings by employer |
| `POST` | `/api/applications/apply` | `JOB_SEEKER` | Submit application to a job advertisement |
| `GET` | `/api/applications/by-jobseeker/{id}` | `JOB_SEEKER` | View candidate's submitted applications |

---

## 5. Rate Limiting & Protection

- **Protected Endpoints**: `/api/auth/login`, `/api/auth/register/employer`, `/api/auth/register/job-seeker`
- **Mechanism**: In-memory IP-based sliding window (`RateLimiterService`)
- **Limit**: Max 20 requests per minute per IP.
- **Violation Response**: `429 Too Many Requests`
  ```json
  {
    "succes": false,
    "message": "Too many requests. Please try again later."
  }
  ```

---

## 6. Standardized Response Format

All responses follow the unified `Result` / `DataResult<T>` envelope format:

### Success Response (`DataResult<T>`)
```json
{
  "succes": true,
  "message": "Login successful.",
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "role": "EMPLOYER",
    "expiresIn": 900000,
    "userId": 12,
    "email": "recruiter@acme.com",
    "name": "Acme Corp"
  }
}
```

### Error Response (`ErrorResult` / `401 Unauthorized` / `403 Forbidden`)
```json
{
  "succes": false,
  "message": "Unauthorized: Authentication token is missing, invalid, or expired."
}
```

---

## 7. CORS Configuration

- **Allowed Origins**: `http://localhost:3000` (Next.js frontend in development)
- **Allowed Methods**: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`, `PATCH`
- **Allowed Headers**: `Authorization`, `Content-Type`, `Accept`, `X-Requested-With`, `Origin`, `Cookie`
- **Exposed Headers**: `Authorization`, `Set-Cookie`
- **Allow Credentials**: `true`
