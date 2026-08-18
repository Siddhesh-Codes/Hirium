# HRMS Frontend Application

A production-grade, enterprise-hardened Human Resource Management System (HRMS) frontend built with Next.js 14 App Router, TypeScript, Tailwind CSS, TanStack Query, Zustand, Zod, and Axios.

---

## 1. Architectural Overview & Tech Stack

| Layer / Concern | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | Server-side rendered shell & client-side interactive route views |
| **Language** | TypeScript (Strict Mode) | Complete type safety, typed API envelopes (`ApiResult<T>`) |
| **Styling** | Tailwind CSS + Custom Design Tokens | Hand-authored, anti-slop color palette with zero purple/blue slop |
| **Server State** | TanStack Query v5 | Caching, deduplication, background invalidation, and optimistic mutations |
| **Client Auth State**| Zustand (In-Memory) | Ephemeral token storage to protect against XSS token harvesting |
| **Form Validation** | Zod + React Hook Form | Schema validation mirroring backend Jakarta constraints |
| **HTTP Client** | Axios + Interceptors | Automatic Bearer token attachment and transparent 401 silent token refresh |
| **Iconography** | Lucide React | Clean, minimalist, consistent stroke width (1.5–1.75) |

---

## 2. Hand-Authored Anti-Slop Design System

The application strictly adheres to the custom enterprise design guidelines:

- **No Purple / Blue / Indigo**: Primary accents and backgrounds avoid default AI-slop palettes.
- **No Emojis**: Replaced with crisp, semantic Lucide icons throughout alerts, empty states, toasts, and navigation.
- **Palette**:
  - **Background**: `#F7F5F1` (warm off-white light) / `#0E0E10` (graphite dark)
  - **Surface**: `#FFFFFF` (pure white surface) / `#F0ECE4` (subtle contrast surface)
  - **Ink (Text)**: `#161513` (high-contrast primary ink) / `#6B675F` (secondary muted text)
  - **Borders & Hairlines**: `#E4E0D8` (clean structural boundary)
  - **Single Accent**: `#B9852F` (warm amber/ochre)
  - **Semantic Tones**:
    - Success: `#3E7A4C` / `#EEF6F0`
    - Danger: `#B3402F` / `#FCEFEB`
    - Warning: `#C08A2E` / `#FDF7E7`
- **Typography Hierarchy**:
  - Headings: `Newsreader` / `Instrument Serif` (editorial display serif)
  - Interface & Body: `Inter` / system-ui (clean, readable grotesque)
  - Numeric & Identifiers: `JetBrains Mono` (tabular numbers for salary ranges, counts, dates, and IDs)

---

## 3. Authentication & Security Architecture

### In-Memory Token Lifecycle
1. **Login (`POST /api/auth/login`)**:
   - The backend responds with `{ accessToken, role, expiresIn, userId, email, name }` and attaches an `httpOnly`, `Secure`, `SameSite=Strict` cookie named `refreshToken`.
   - The frontend stores `accessToken` strictly in Zustand's in-memory state.
   - **Never written to `localStorage` or `sessionStorage`** to eliminate XSS token exfiltration risks.
2. **Authenticated Requests**:
   - The Axios request interceptor attaches `Authorization: Bearer <accessToken>`.
   - `withCredentials: true` ensures the refresh cookie travels with API requests.
3. **Transparent 401 Token Refresh (`POST /api/auth/refresh`)**:
   - When the 15-minute access token expires, the Axios response interceptor intercepts the `401 Unauthorized` response.
   - It pauses failed requests, executes a silent refresh via the `httpOnly` cookie, updates the in-memory access token, and retries the original request seamlessly.
   - If the refresh token is also expired or invalid, the session is cleared and the user is redirected to `/login?session=expired`.
4. **App Initialization & Silent Hydration**:
   - `AuthProvider` attempts a silent refresh on initial application mount. If a valid cookie exists, the user is seamlessly authenticated without storing secrets in local storage.
5. **Logout (`POST /api/auth/logout`)**:
   - Revokes the refresh token on the backend and clears client state.

---

## 4. Route Map & Permissions

| Path | Access Level | Description |
| :--- | :--- | :--- |
| `/` | Public | Landing page with value proposition, live platform metrics, and recent openings preview |
| `/jobs` | Public | Comprehensive job board with keyword search, city filter, title filter, and salary sort |
| `/jobs/[id]` | Public / Candidate | Detailed job view with requirements, company contact details, and candidate apply modal |
| `/login` | Public (Unauth) | Unified authentication form with expired session notification and redirect recall |
| `/register` | Public (Unauth) | Tabbed registration for Employers (company info) and Candidates (national ID validation) |
| `/dashboard` | Authenticated | Overview metrics for active postings (Employer) or submitted applications (Candidate) |
| `/dashboard/jobs` | Role: `EMPLOYER` | Manage job postings table with link to applicant review |
| `/dashboard/jobs/new` | Role: `EMPLOYER` | Publish new job opening with dynamic position/city selection and salary range validation |
| `/dashboard/jobs/[id]/applications` | Role: `EMPLOYER` | View candidates who applied to post `[id]` with Approve / Reject / Reset actions |
| `/dashboard/applications` | Role: `JOB_SEEKER` | Candidate's personal tracking table for submitted applications and review statuses |
| `/dashboard/profile` | Authenticated | Account details, system user ID, and role badge |
| `/dashboard/settings` | Authenticated | Security parameters, token rotation policies, and session overview |

---

## 5. Development & Build Commands

Ensure the Spring Boot backend is running on `http://localhost:8080`.

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run TypeScript type check
npm run type-check

# Run development server (runs on http://localhost:3000)
npm run dev

# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 6. Environment Variables

Create a `.env.local` file in the `frontend` directory if customizing backend URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```
