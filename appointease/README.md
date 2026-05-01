# Academic Appointment Booking System 

> A full-stack web application for scheduling academic appointments between students and school offices/faculty. Built with Angular + Node.js + MongoDB.

---

## Live Links

| Service | URL |
|---------|-----|
| **Frontend (Angular)** | *(add your Vercel URL here after deployment)* |
| **Backend API** | *(add your Render URL here after deployment)* |
| **Swagger API Docs** | `<your-backend-url>/api-docs` |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Angular 17 (Standalone Components), Tailwind CSS, RxJS |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT (Access Tokens) |
| **File Upload** | Multer + Cloudinary |
| **API Docs** | Swagger / OpenAPI 3.0 |
| **Deployment** | Vercel (Frontend) + Render (Backend) |

---

## Setup Instructions

### Prerequisites
- Node.js >= 18
- Angular CLI: `npm install -g @angular/cli`
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

### 1. Clone the Repository
```bash
git clone https://github.com/Gingis/appointment-booking-system.git
cd appointment-booking-system
```

### 2. Backend Setup
```bash
cd server
npm install
cp ../.env.example .env
# Edit .env and fill in: MONGO_URI, JWT_SECRET, CLOUDINARY credentials, CLIENT_URL
npm run dev
# Server runs at http://localhost:3000
# Swagger docs at http://localhost:3000/api-docs
```

### 3. Seed the Database (first time only)
```bash
cd server
npm run seed
# Creates: admin@school.edu.ph / admin123
#          student@school.edu.ph / student123
# + 12 academic services
```

### 4. Frontend Setup
```bash
cd client
npm install
ng serve
# App runs at http://localhost:4200
```

---

## API Overview

### Auth Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login, returns JWT | Public |
| GET | `/api/auth/me` | Get current user | 🔒 |
| POST | `/api/auth/logout` | Logout | 🔒 |
| PUT | `/api/auth/profile` | Update profile | 🔒 |
| PUT | `/api/auth/password` | Change password | 🔒 |

### Appointment Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/appointments` | List appointments (own / all for admin) | 🔒 |
| POST | `/api/appointments` | Book new appointment | 🔒 |
| GET | `/api/appointments/:id` | Get single appointment | 🔒 |
| PUT | `/api/appointments/:id` | Update appointment | 🔒 |
| PATCH | `/api/appointments/:id/cancel` | Cancel appointment | 🔒 |
| GET | `/api/appointments/stats` | Get stats | 🔒 Admin |

### Service Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/services` | List all active services | Public |
| GET | `/api/services/categories` | Get all categories | Public |
| GET | `/api/services/:id` | Get single service | Public |
| POST | `/api/services` | Create service | 🔒 Admin |
| PUT | `/api/services/:id` | Update service | 🔒 Admin |
| DELETE | `/api/services/:id` | Deactivate service | 🔒 Admin |

### User Endpoints (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user |
| PUT | `/api/users/:id/role` | Change user role |
| PATCH | `/api/users/:id/toggle-status` | Activate/Deactivate |
| DELETE | `/api/users/:id` | Delete user |

### Upload Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/avatar` | Upload profile photo |
| POST | `/api/upload/appointment/:id` | Upload appointment attachment |
| POST | `/api/upload/service` | Upload service image (Admin) |

---

## ✅ Features Implemented

### Student / User Features
- [x] Register & Login with JWT authentication
- [x] Browse academic services by department/category
- [x] Search and filter services
- [x] Book appointments with date & time slot picker
- [x] View all personal appointments with status tracking
- [x] Filter appointments by status and date range
- [x] View detailed appointment info
- [x] Cancel pending/confirmed appointments
- [x] Edit profile (name, phone, student ID, course, year level)
- [x] Upload profile photo
- [x] Change password

### Admin Features
- [x] Admin dashboard with stats (total, pending, confirmed, completed, cancelled)
- [x] View and manage ALL appointments
- [x] Confirm, reject, or complete appointments
- [x] Filter appointments by status and date range
- [x] Full CRUD for academic services (with image upload)
- [x] View all users with search and role filter
- [x] Change user roles (promote to admin / demote)
- [x] Activate / deactivate user accounts
- [x] Delete users

### Technical Features
- [x] Angular 17 Standalone Components
- [x] Lazy-loaded routes
- [x] Route Guards (authGuard, adminGuard, guestGuard)
- [x] JWT Auth Interceptor (auto-injects token)
- [x] Reactive Forms with full validation
- [x] RxJS (debounced search, Observables throughout)
- [x] Signal-based state management
- [x] Pagination on all list pages
- [x] Tailwind CSS responsive design
- [x] Error handling + loading states
- [x] Node.js + Express REST API
- [x] MongoDB with Mongoose ODM
- [x] Role-based access control (Admin / User)
- [x] Input validation with express-validator
- [x] Security middleware: helmet, CORS, rate limiting, mongo-sanitize
- [x] File uploads via Multer + Cloudinary
- [x] Swagger/OpenAPI documentation
- [x] Winston logging
- [x] Database seed script (12 academic services + test accounts)

---

## 🎓 Academic Services Included
- Grade Inquiry / Consultation
- Enrollment & Shifting Assistance
- Transcript of Records Request
- Guidance Counseling Session
- Scholarship Application Consultation
- Research / Thesis Consultation
- Library Research Assistance
- Certificate of Enrollment
- Clearance Processing
- Medical / Clinic Consultation
- Financial Aid / Tuition Assistance
- Student Organization Accreditation

---

## 📸 Screenshots

> See `screenshots/` folder for UI and API testing screenshots.

---

## 🚀 Deployment Guide

### Deploy Backend to Render
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo, set root directory to `server`
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
6. Add all environment variables from `.env.example`

### Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your GitHub repo, set root directory to `client`
3. Framework: Angular
4. Build command: `npm run build -- --configuration=production`
5. Output directory: `dist/appointease-client/browser`
6. Set environment variable: `API_URL` = your Render backend URL

---

## 👥 Group Members

| Name | Role |
|------|------|
| Member 1 | Frontend Developer (Angular, UI/UX) |
| Member 2 | Backend Developer (Node.js, MongoDB) |
| Member 3 | Auth/Security + Repository Manager |

---

## 📁 Repository Structure

```
appointment-booking-system/
├── client/                         → Angular 17 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/         → Navbar, Footer, Loading
│   │   │   ├── guards/             → authGuard, adminGuard, guestGuard
│   │   │   ├── interceptors/       → JWT auth interceptor
│   │   │   ├── models/             → TypeScript interfaces
│   │   │   ├── pages/              → All page components
│   │   │   │   ├── home/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── services/
│   │   │   │   ├── booking/
│   │   │   │   ├── appointments/
│   │   │   │   ├── appointment-detail/
│   │   │   │   ├── profile/
│   │   │   │   └── admin/
│   │   │   │       ├── admin-dashboard/
│   │   │   │       ├── admin-appointments/
│   │   │   │       ├── admin-services/
│   │   │   │       └── admin-users/
│   │   │   └── services/           → HTTP services (auth, appointments, etc.)
│   │   └── environments/
│   ├── angular.json
│   ├── tailwind.config.js
│   └── vercel.json
│
├── server/                         → Node.js + Express Backend
│   ├── src/
│   │   ├── config/                 → DB, Swagger, Cloudinary
│   │   ├── controllers/            → Auth, Appointment, Service, User, Upload
│   │   ├── middleware/             → Auth, Validation, Error Handler
│   │   ├── models/                 → User, Service, Appointment
│   │   ├── routes/                 → All API routes with Swagger docs
│   │   └── utils/                  → Logger, JWT helpers, Seed script
│   ├── package.json
│   └── tsconfig.json
│
├── screenshots/                    → UI + API testing screenshots
├── render.yaml                     → Render deployment config
├── .env.example                    → Environment variables template
├── .gitignore
└── README.md                       → This file
```
