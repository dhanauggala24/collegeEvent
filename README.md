# 🎓 CampusConnect — Production-Ready College Event Portal (MERN Stack)

A complete, full-stack **College Event Portal** built with **MongoDB, Express.js, React, and Node.js (MERN)** featuring **Role-Based Authentication for Students and Faculty Admins**. The portal provides a centralized platform for university faculties, clubs, and students to discover, schedule, register for, and manage campus events across technical, cultural, sports, and academic departments.

---

## 🌟 Key Features

### 🔐 Authentication & Role-Based Access Control
- **Dual Role Registration & Login**:
  - **Student Account**: Browse upcoming events, 1-click RSVP registration, view personal registered events list with the "My RSVPs" dashboard filter.
  - **Faculty / Admin Account**: Create, publish, update, and delete campus events, manage capacities, and monitor portal analytics.
- **Security & Password Hashing**: Passwords securely hashed with `bcryptjs` (salt rounds: 10), and stateless session authentication powered by JSON Web Tokens (`jsonwebtoken`).
- **Quick Demo Credentials**: Built-in 1-click quick-fill buttons in the login modal for instant testing:
  - **Admin**: `admin@college.edu` / `Password123`
  - **Student**: `student@college.edu` / `Password123`
- **Protected Endpoints**: Flexible `protect` and `authorize('admin')` middleware ensuring strict role verification on sensitive backend operations.

### 📅 Event Management & Interactive Dashboard
- **Decoupled Architecture**: Cleanly separated `backend` (REST API) and `frontend` (React Single Page App) environments.
- **Database & Mongoose**: Resilient MongoDB connection with event lifecycle hooks, indexing, text search, and virtual getters (`spotsRemaining`, `isFull`).
- **Full RESTful Event CRUD**:
  - `POST /api/events` — Publish new college event with robust payload validation.
  - `GET /api/events` — Retrieve events with multi-criteria filtering (category, department, upcoming-only, keyword search, and pagination).
  - `GET /api/events/:id` — Detailed event metadata and registration status.
  - `PUT /api/events/:id` — Update event logistics, schedules, and capacity (Admin only).
  - `DELETE /api/events/:id` — Remove events with database cascade cleanup (Admin only).
  - `POST /api/events/:id/register` — Atomic 1-click RSVP with capacity checking and student account linking.
  - `GET /api/events/stats` — Real-time event analytics and department breakdown.
- **Modern Responsive Dashboard UI**:
  - Responsive event cards with visual capacity progress bars (`% booked`).
  - Category pill filters & department dropdowns.
  - Interactive search bar with instant debounce filtering.
  - Modal workflows for event creation, editing, and comprehensive detail inspection.
  - Real-time toast notifications for user actions.
- **Testing Suite**: 29 automated unit and integration tests across Auth, Database, and REST API endpoints.

---

## 📁 Project Directory Structure

```
eventsportal/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Resilient MongoDB Mongoose connection handler
│   │   ├── controllers/
│   │   │   ├── authController.js     # User registration (Student/Admin), login & profile
│   │   │   └── eventController.js    # Event CRUD, search, filter, RSVP & stats logic
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT token verification & role authorization
│   │   │   ├── errorHandler.js       # Centralized HTTP & Mongoose error handling
│   │   │   └── validateEvent.js      # Input validation middleware
│   │   ├── models/
│   │   │   ├── User.js               # User schema with roles, bcrypt hashing & JWT methods
│   │   │   └── Event.js              # Event schema, validation, indexes & virtuals
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth/register, /api/auth/login, /api/auth/me
│   │   │   └── eventRoutes.js        # RESTful API route definitions
│   │   ├── app.js                    # Express app configuration & middleware
│   │   ├── server.js                 # Server entry point & graceful shutdown
│   │   └── seed.js                   # Database seeder with sample events and admin/student users
│   ├── tests/
│   │   ├── setup.js                  # In-memory MongoDB testing harness
│   │   ├── auth.test.js              # Student & Admin registration, login & JWT tests
│   │   ├── db.test.js                # Database connection & schema validation tests
│   │   └── event.test.js             # API endpoint integration tests (Supertest)
│   ├── .env.example                  # Backend environment template
│   ├── .gitignore                    # Backend ignore rules
│   ├── Dockerfile                    # Multi-stage production container
│   └── package.json                  # Backend dependencies & test scripts
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Header navigation, user profile pill & auth buttons
│   │   │   ├── AuthModal.jsx         # Unified Student & Admin Sign In / Sign Up modal
│   │   │   ├── StatsSummary.jsx      # Portal metric summary cards
│   │   │   ├── FilterBar.jsx         # Search, category pills, & department filters
│   │   │   ├── EventCard.jsx         # Card with capacity progress & RSVP status
│   │   │   ├── EventDetailsModal.jsx # Full-page event detail modal
│   │   │   ├── EventFormModal.jsx    # Create/Edit event modal form (Admin)
│   │   │   └── Toast.jsx             # Alert toast notifications
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global authentication state, login, register, logout
│   │   ├── services/
│   │   │   └── api.js                # Unified HTTP API client for backend
│   │   ├── App.jsx                   # Main dashboard view state & controllers
│   │   ├── index.css                 # Clean modern CSS design system
│   │   └── main.jsx                  # React application entry point with AuthProvider
│   ├── index.html                    # Single page HTML entry
│   ├── vite.config.js                # Vite build tool & reverse proxy config
│   ├── nginx.conf                    # Production reverse proxy config for Docker
│   ├── Dockerfile                    # Production container build
│   ├── .env.example                  # Frontend environment template
│   ├── .gitignore                    # Frontend ignore rules
│   └── package.json                  # Frontend dependencies
├── docker-compose.yml                # Full-stack orchestration (MongoDB + API + React + Nginx)
├── .gitignore                        # Root repository gitignore
├── package.json                      # Root convenience scripts
└── README.md                         # Complete project documentation
```

---

## 👥 Role Permissions Matrix

| Feature / Action | Guest (Unauthenticated) | Student | Faculty / Admin |
| :--- | :---: | :---: | :---: |
| Browse & Search Events | ✅ | ✅ | ✅ |
| View Event Logistics & Details | ✅ | ✅ | ✅ |
| Filter by Category / Department | ✅ | ✅ | ✅ |
| Sign Up / Log In | ✅ | ✅ | ✅ |
| RSVP / Register for Events | 🔒 Prompts Sign In | ✅ 1-Click RSVP | ✅ |
| View "My RSVPs" Dashboard Tab | ❌ | ✅ | ✅ |
| Create / Publish New Events | 🔒 Admin Required | ❌ | ✅ |
| Edit Existing Events | ❌ | ❌ | ✅ |
| Delete Events | ❌ | ❌ | ✅ |

---

## ⚙️ Prerequisites

- **Node.js** (v18.x or later) — [Download Node.js](https://nodejs.org/)
- **npm** (v9.x or later)
- **MongoDB** (Local instance or free cloud cluster on [MongoDB Atlas](https://www.mongodb.com/atlas))

---

## 🚀 Quick Start Guide

### 1. Clone or Open the Repository
```bash
cd eventsportal
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

Verify your `.env` configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/college_events
JWT_SECRET=supersecret_college_event_portal_jwt_token_2026
CLIENT_URL=http://localhost:5173
```

#### Seed Database (Sample Events & Accounts)
```bash
npm run seed
```
This populates sample hackathons, symposiums, and cultural events along with:
- **Admin**: `admin@college.edu` / `Password123`
- **Student**: `student@college.edu` / `Password123`

#### Start Backend in Development Mode
```bash
npm run dev
# The backend will start on http://localhost:5000
```

---

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start Vite dev server
npm run dev
# The React dashboard will be available at http://localhost:5173
```

---

## 🐳 Running with Docker Compose

Run the entire MERN stack (MongoDB 6, Express API, and React frontend served via Nginx) with a single command:

```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- MongoDB: `localhost:27017`

---

## 🧪 Running Automated Tests

Run all 29 automated tests across Auth, Database connection, and REST API endpoints:

```bash
cd backend
npm test
```

### Test Suite Summary:
```text
PASS tests/auth.test.js
PASS tests/event.test.js
PASS tests/db.test.js

Test Suites: 3 passed, 3 total
Tests:       29 passed, 29 total
Snapshots:   0 total
Time:        12.152 s
```

---

## 📡 RESTful API Reference

Base URL: `http://localhost:5000/api`

### Authentication Endpoints

| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new Student or Admin account | `{ name, email, password, role, department, studentId, adminSecret }` |
| `POST` | `/auth/login` | Login user & receive JWT token | `{ email, password }` |
| `GET` | `/auth/me` | Get logged-in user profile & RSVPs | Header: `Authorization: Bearer <token>` |

### Event Management Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server health & readiness | Public |
| `GET` | `/events/stats` | Analytics & registration totals | Public |
| `GET` | `/events` | List events with filters & search | Public |
| `GET` | `/events/:id` | Get single event details | Public |
| `POST` | `/events` | Create a new event | Admin |
| `PUT` | `/events/:id` | Update existing event | Admin |
| `DELETE`| `/events/:id` | Delete event | Admin |
| `POST` | `/events/:id/register` | RSVP / Register attendee | Student / Authenticated |

---

## 🐙 Complete Git Initialization & GitHub Push Instructions

### Step 1: Open Terminal in Project Root
```bash
cd c:\Users\Mr\ Nani\Desktop\eventsportal
```

### Step 2: Initialize Git & Verify Ignore Rules
```bash
git init
git status
```

### Step 3: Stage and Commit
```bash
git add .
git commit -m "feat: complete college event portal with student and admin authentication"
git branch -M main
```

### Step 4: Link Remote and Push to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/college-event-portal.git

# Push your code to GitHub
git push -u origin main
```

---

## 📄 License
This project is open-source and available under the **MIT License**.
