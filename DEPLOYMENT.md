# HRMS Production Deployment Guide (Neon DB + Render + Vercel)

This guide walks you through deploying the full-stack HRMS application using **Neon Serverless PostgreSQL**, **Render** (Backend), and **Vercel** (Frontend) with **zero secret keys committed to Git**.

---

## Architecture Flow

```
[ Client Browser ]
        │
        ▼
[ Next.js 14 Frontend ]  ---> (Vercel Global Edge)
        │
        │ HTTPS REST Calls + JWT Auth
        ▼
[ Spring Boot 3 API ]    ---> (Render Web Service)
        │
        │ SSL Encrypted JDBC Pool
        ▼
[ Neon PostgreSQL DB ]   ---> (Neon Serverless Postgres)
```

---

## Step 1: Create Your Neon PostgreSQL Database

1. Go to **[https://neon.tech](https://neon.tech)** and sign up for a free account.
2. Click **Create Project** (Name: `hrms-db`).
3. Under **Dashboard > Connection Details**, select **Java / JDBC** from the dropdown.
4. Copy the connection parameters:
   - **Host**: `ep-xxxx.region.aws.neon.tech`
   - **Database**: `neondb`
   - **Username**: (e.g. `neondb_owner`)
   - **Password**: (your generated secret password)
   - **JDBC URL Format**:
     ```
     jdbc:postgresql://ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
     ```

> [!NOTE]
> Neon automatically requires SSL (`?sslmode=require`). The Spring Boot application has Hikari connection pooling pre-configured to handle Neon's serverless autoscaling.

---

## Step 2: Deploy Spring Boot Backend (Render / Railway)

### Using [Render.com](https://render.com):

1. Go to your Render dashboard and click **New + > Web Service**.
2. Connect your GitHub repository: `hmrs-app`.
3. Configure the service:
   - **Name**: `hrms-api`
   - **Runtime**: **Docker** (Render will automatically detect the root `Dockerfile`)
   - **Instance Type**: Free
4. Under **Environment Variables**, add the following keys (**never commit these to Git**):

| Environment Variable | Value / Description | Example |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | Neon JDBC Connection String | `jdbc:postgresql://ep-xxxx.region.aws.neon.tech/neondb?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | Neon DB Username | `neondb_owner` |
| `SPRING_DATASOURCE_PASSWORD` | Neon DB Password | *(Your secret password from Neon)* |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Hibernate Schema Mode | `update` |
| `JWT_SECRET` | 256-bit Hex Security Key | *(Generate via `openssl rand -hex 32`)* |
| `JWT_ACCESS_TOKEN_EXPIRATION_MS`| Access Token Lifetime | `604800000` (7 Days) |
| `JWT_REFRESH_TOKEN_EXPIRATION_MS`| Refresh Cookie Lifetime | `2592000000` (30 Days) |
| `CORS_ALLOWED_ORIGINS` | Your Frontend URL | `https://your-app.vercel.app` |
| `PORT` | Spring Boot Port | `8080` |

5. Click **Create Web Service**.
6. When deployment finishes, copy your live backend URL (e.g. `https://hrms-api-xxxx.onrender.com`).

---

## Step 3: Deploy Next.js Frontend (Vercel)

### Using [Vercel](https://vercel.com):

1. Go to [Vercel](https://vercel.com) and click **Add New... > Project**.
2. Import your GitHub repository: `hmrs-app`.
3. In the project setup:
   - **Framework Preset**: Next.js
   - **Root Directory**: Click **Edit** and choose `frontend`.
4. Under **Environment Variables**, add:

| Environment Variable | Value |
| :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | `https://hrms-api-xxxx.onrender.com` *(Your live Render backend URL)* |

5. Click **Deploy**.
6. Vercel will build and assign you a global production URL (e.g. `https://hmrs-frontend.vercel.app`).

---

## Step 4: Final Connection & Verification

1. Go back to your **Render Backend Dashboard > Environment Variables**.
2. Ensure `CORS_ALLOWED_ORIGINS` is set to your exact Vercel URL (e.g. `https://hmrs-frontend.vercel.app`).
3. Open your Vercel URL in your browser:
   - **Register** a test employer or candidate account.
   - The data is now securely stored in your **Neon PostgreSQL cloud database** with BCrypt hashing and dual-token JWT security.

---

## Production Security Measures

- **Zero Secrets in Code**: All sensitive keys (`SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`) are injected dynamically through encrypted platform environment variables.
- **Git Protection**: `.gitignore` blocks `.env`, `.env.local`, `.env.production`, and credential files from ever entering source control.
- **Auto-Seeding**: On first boot against an empty Neon database, the system will automatically seed initial job positions and Indian metropolitan cities.
