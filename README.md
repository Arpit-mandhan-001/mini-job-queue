# Mini Job Queue Dashboard

A simple, clean, startup-style Mini Job Queue Dashboard built with NestJS, TypeORM, PostgreSQL, React, TypeScript, Vite, and Tailwind CSS.

---

## 🛠 Tech Stack

- **Frontend:** React.js, TypeScript, Vite, Tailwind CSS (Custom SaaS Palette), Lucide Icons
- **Backend:** NestJS, TypeScript, TypeORM, PostgreSQL
- **Validation:** `class-validator`, `class-transformer`
- **Config:** Environment-driven (`.env`) for DB connection & API base URLs

---

## 📁 Directory & Folder Structure

```
Mini-job-queue/
├── backend/
│   ├── src/
│   │   ├── jobs/
│   │   │   ├── dto/
│   │   │   │   ├── create-job.dto.ts
│   │   │   │   └── update-job-status.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── job.entity.ts
│   │   │   ├── jobs.controller.ts
│   │   │   ├── jobs.service.ts
│   │   │   └── jobs.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── package.json
│   ├── .env.example
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateJobModal.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── JobCard.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── StatusCard.tsx
│   │   ├── hooks/
│   │   │   └── useJobs.ts
│   │   ├── pages/
│   │   │   └── DashboardPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── job.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── .env.example
│   └── .env
├── .gitignore
└── README.md
```

### Purpose of Key Folders

| Path | Purpose |
| :--- | :--- |
| `backend/src/jobs/dto/` | Contains Request Data Transfer Objects with validation annotations (`create-job.dto.ts`, `update-job-status.dto.ts`). |
| `backend/src/jobs/entities/` | Contains the TypeORM database entity schema (`job.entity.ts`) representing the PostgreSQL `jobs` table. |
| `backend/src/jobs/jobs.controller.ts` | Exposes REST endpoints (`POST`, `GET`, `PATCH`, `DELETE`) for job management. |
| `backend/src/jobs/jobs.service.ts` | Contains data access logic and enforces job status transition rules (`pending` → `running` → `completed`/`failed`). |
| `frontend/src/components/` | Modular, reusable UI components for header, metric cards, job list items, status badges, and job creation modal. |
| `frontend/src/pages/` | Screen views (e.g., `DashboardPage.tsx`) assembling status metrics, filter controls, error alerts, and job lists. |
| `frontend/src/services/` | Centralized API client module (`api.ts`) managing HTTP requests to the backend endpoints. |
| `frontend/src/types/` | TypeScript type declarations (`job.ts`) for jobs, statuses, and counts. |
| `frontend/src/hooks/` | Custom React hook (`useJobs.ts`) encapsulating state management, API synchronization, filtering, and metric calculation. |

---

## ⚡ Setup & Run Instructions

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL server running locally or via Docker

### 2. Backend Setup
```bash
cd backend
npm install
# Configure your database details in backend/.env
npm run start:dev
```
Backend will run on `http://localhost:3000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:5173`.

---

## 🔄 Allowed Job Status Transitions

- `pending` → `running`
- `running` → `completed`
- `running` → `failed`

*Note: Completed or failed jobs cannot transition back to running or pending state.*
