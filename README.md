# 🎓 CampusConnect — Production-Ready College Event Portal (MERN Stack)

A complete, full-stack **College Event Portal** built with **MongoDB, Express.js, React, and Node.js (MERN)**. The portal provides a centralized platform for university faculties, clubs, and students to discover, schedule, register for, and manage campus events across technical, cultural, sports, and academic departments.

---

## 🌟 Key Features

- **Decoupled Architecture**: Cleanly separated `backend` (REST API) and `frontend` (React Single Page App) environments.
- **Database & Mongoose**: Resilient MongoDB connection with event lifecycle hooks, indexing, text search, and virtual getters (`spotsRemaining`, `isFull`).
- **Full RESTful Event CRUD**:
  - `POST /api/events` — Publish new college event with robust payload validation.
  - `GET /api/events` — Retrieve events with multi-criteria filtering (category, department, upcoming-only, keyword search, and pagination).
  - `GET /api/events/:id` — Detailed event metadata and registration status.
  - `PUT /api/events/:id` — Update event logistics, schedules, and capacity.
  - `DELETE /api/events/:id` — Remove events with database cascade cleanup.
  - `POST /api/events/:id/register` — Atomic 1-click RSVP with capacity checking and race condition guards.
  - `GET /api/events/stats` — Real-time event analytics and department breakdown.
- **Modern Responsive Dashboard UI**:
  - Responsive event cards with visual capacity progress bars (`% booked`).
  - Category pill filters & department dropdowns.
  - Interactive search bar with instant debounce filtering.
  - Modal workflows for event creation, editing, and comprehensive detail inspection.
  - Real-time toast notifications for user actions.
- **Testing Suite**:
  - Automated database connection tests using in-memory MongoDB.
  - Supertest HTTP test suite verifying all CRUD endpoints and input validation.
- **Production-Ready Hygiene**:
  - Security headers enabled with `helmet`.
  - Configurable `cors` middleware.
  - HTTP request logging via `morgan`.
  - Comprehensive multi-tier `.gitignore` files preventing accidental credential leaks.

---

## 📁 Project Directory Structure

```
eventsportal/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Resilient MongoDB Mongoose connection handler
│   │   ├── controllers/
│   │   │   └── eventController.js    # Event CRUD & Analytics business logic
│   │   ├── middleware/
│   │   │   ├── errorHandler.js       # Centralized HTTP & Mongoose error handling
│   │   │   └── validateEvent.js      # Input validation middleware
│   │   ├── models/
│   │   │   └── Event.js              # Mongoose schema, validation & indexes
│   │   ├── routes/
│   │   │   └── eventRoutes.js        # RESTful API route definitions
│   │   ├── app.js                    # Express app configuration & middleware
│   │   ├── server.js                 # Server entry point & graceful shutdown
│   │   └── seed.js                   # Database seeder with sample college events
│   ├── tests/
│   │   ├── setup.js                  # In-memory MongoDB testing harness
│   │   ├── db.test.js                # Database connection & schema validation tests
│   │   └── event.test.js             # API endpoint integration tests (Supertest)
│   ├── .env.example                  # Backend environment template
│   ├── .gitignore                    # Backend ignore rules
│   └── package.json                  # Backend dependencies & test scripts
├── frontend/
│   ├── public/                       # Static public assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Header navigation & quick actions
│   │   │   ├── StatsSummary.jsx      # Portal metric summary cards
│   │   │   ├── FilterBar.jsx         # Search, category pills, & department filters
│   │   │   ├── EventCard.jsx         # Card with capacity progress & quick actions
│   │   │   ├── EventDetailsModal.jsx # Full-page event detail modal
│   │   │   ├── EventFormModal.jsx    # Create/Edit event modal form
│   │   │   └── Toast.jsx             # Alert toast notifications
│   │   ├── services/
│   │   │   └── api.js                # Unified HTTP API client for backend
│   │   ├── App.jsx                   # Main dashboard view state & controllers
│   │   ├── index.css                 # Clean modern CSS design system
│   │   └── main.jsx                  # React application entry point
│   ├── index.html                    # Single page HTML entry
│   ├── vite.config.js                # Vite build tool & reverse proxy config
│   ├── .env.example                  # Frontend environment template
│   ├── .gitignore                    # Frontend ignore rules
│   └── package.json                  # Frontend dependencies
├── .gitignore                        # Root repository gitignore
├── package.json                      # Root convenience scripts
└── README.md                         # Complete project documentation
```

---

## ⚙️ Prerequisites

- **Node.js** (v18.x or later) — [Download Node.js](https://nodejs.org/)
- **npm** (v9.x or later) or **yarn** / **pnpm**
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
CLIENT_URL=http://localhost:5173
```
*(If using MongoDB Atlas, replace `MONGODB_URI` with your connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/college_events?retryWrites=true&w=majority`)*

#### Seed the Database (Optional but Recommended)
Populate the database with sample college hackathons, cultural festivals, tech workshops, and sports tournaments:
```bash
npm run seed
```

#### Start Backend in Development Mode
```bash
npm run dev
# The backend will start on http://localhost:5000
```

---

### 3. Frontend Setup
In a new terminal window:
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

## 🧪 Running Automated Tests

The backend includes test suites for database connectivity and REST API endpoints using **Jest**, **Supertest**, and **mongodb-memory-server** (which runs an isolated, in-memory MongoDB instance without requiring an external database).

```bash
cd backend
npm test
```

### What is Tested:
1. **Database & Schema Tests (`tests/db.test.js`)**:
   - Mongoose connection status and heartbeat.
   - Event model persistence and field constraints.
   - Virtual getters (`spotsRemaining`, `isFull`).
   - Email format validation.
   - Missing required field validation.
2. **REST API Endpoint Tests (`tests/event.test.js`)**:
   - `GET /api/health` — Service readiness and uptime.
   - `POST /api/events` — Event creation & input validation errors.
   - `GET /api/events` — Event listing, search query, and category filters.
   - `GET /api/events/:id` — Single event retrieval & 404 handling.
   - `PUT /api/events/:id` — Updating event details and capacity checks.
   - `DELETE /api/events/:id` — Event deletion and verification.
   - `POST /api/events/:id/register` — RSVP increment & capacity limit guard.
   - `GET /api/events/stats` — Aggregate metrics calculation.

---

## 📡 RESTful API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server health check | — |
| `GET` | `/events/stats` | Analytics & registration totals | — |
| `GET` | `/events` | List events (with search & filters) | `?search=...&category=...&department=...&upcomingOnly=true&sortBy=date` |
| `GET` | `/events/:id` | Get single event details | — |
| `POST` | `/events` | Create a new event | JSON body (see schema below) |
| `PUT` | `/events/:id` | Update existing event | JSON body fields to update |
| `DELETE`| `/events/:id` | Delete event | — |
| `POST` | `/events/:id/register` | Register attendee for event | Increments registration counter |

### Sample Event JSON Payload:
```json
{
  "title": "HackInnovate 2026: 36-Hour National Hackathon",
  "description": "Join 500+ builders to build AI and Climate Tech solutions. $10k+ in prizes.",
  "category": "Hackathon",
  "department": "Computer Science",
  "date": "2026-11-25",
  "time": "09:00 AM - 09:00 PM",
  "venue": "Campus Innovation Hub, Block C",
  "organizer": "ACM Student Chapter",
  "organizerEmail": "hackinnovate@college.edu",
  "capacity": 250,
  "bannerUrl": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
  "tags": ["hackathon", "coding", "ai"]
}
```

---

## 🐙 Complete Git Initialization & GitHub Push Instructions

Follow these step-by-step commands to push this project to your GitHub repository:

### Step 1: Open Terminal in the Project Root
```bash
cd c:\Users\Mr\ Nani\Desktop\eventsportal
```

### Step 2: Initialize Git Repository
```bash
git init
```

### Step 3: Verify `.gitignore` is Active
Ensure `node_modules` and `.env` files are ignored:
```bash
git status
```
*(You should see `backend/`, `frontend/`, `.gitignore`, `package.json`, and `README.md`, but NEVER `node_modules` or `.env`)*

### Step 4: Stage All Files
```bash
git add .
```

### Step 5: Commit Your Changes
```bash
git commit -m "feat: complete production-ready college event portal (MERN stack)"
```

### Step 6: Rename Default Branch to `main` (if not already)
```bash
git branch -M main
```

### Step 7: Create a New Repository on GitHub
1. Go to [https://github.com/new](https://github.com/new).
2. Enter repository name (e.g., `college-event-portal`).
3. Leave **"Initialize this repository with a README"** UNCHECKED (we already have a complete one).
4. Click **Create repository**.

### Step 8: Link Remote and Push
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/college-event-portal.git

# Push your code to GitHub
git push -u origin main
```

---

## 🛡️ Security & Best Practices

1. **Environment Variables**: Sensitive connection strings and secrets are stored in `.env` and kept out of version control by comprehensive `.gitignore` rules.
2. **Security Headers**: `helmet` is enabled by default to secure HTTP headers against common attacks (XSS, clickjacking, etc.).
3. **Mongoose Sanitization**: Structured Mongoose schemas and strict validation middleware prevent unexpected fields or malformed data injection.
4. **Resilient DB Connections**: Includes connection retry logic, event listeners, and graceful shutdown handlers on `SIGINT` / `SIGTERM`.

---

## 📄 License
This project is open-source and available under the **MIT License**.
