# Mini Job Queue Dashboard

A simple full-stack Job Queue Management Dashboard built with React, NestJS, and PostgreSQL.

The application allows users to create jobs, view jobs, filter them by status, update their status, and delete jobs.

The main focus of the project is clean API design, validation, error handling, and safe job status transitions.

## Features

- Create a new job
- View all jobs
- Filter jobs by status
- View job counts by status
- Update job status
- Delete jobs
- Form validation
- API error handling
- Loading states
- Empty states
- Safe status transitions
- Concurrent status update handling
- Health check endpoint

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- NestJS
- TypeScript
- TypeORM
- class-validator

### Database

- PostgreSQL

## Project Structure

```text
job-queue-dashboard/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateJobModal.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobForm.tsx
│   │   │   ├── JobRow.tsx
│   │   │   ├── JobTable.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── StatusCard.tsx
│   │   │   └── StatusFilter.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── jobService.ts
│   │   ├── types/
│   │   │   └── job.ts
│   │   ├── hooks/
│   │   │   └── useJobs.ts
│   │   ├── pages/
│   │   │   └── DashboardPage.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── .env.example
│
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
│   │   ├── health/
│   │   │   ├── health.controller.ts
│   │   │   └── health.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

## API Endpoints

- `GET /health` — Application health check
- `POST /jobs` — Create a new job (initial status `pending`)
- `GET /jobs` — Fetch all jobs
- `PATCH /jobs/:id/status` — Update job status (`pending` → `running` → `completed`/`failed`)
- `DELETE /jobs/:id` — Delete a job

## State Machine & Status Transitions

Allowed transitions:
- `pending` → `running`
- `running` → `completed`
- `running` → `failed`

*Note: Atomic SQL queries enforce row-level safety, returning `409 Conflict` if a concurrent request alters job state ahead of time.*

## Getting Started

### Backend
```bash
cd backend
npm install
# Configure PostgreSQL details in backend/.env
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
