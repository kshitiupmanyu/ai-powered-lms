# AI Learning Platform
### DBMS Mini Project — 21CSC205P

Full-stack web app connected to `ai_learning_platform` MySQL database.

---

## Project Structure

```
ai-learning-platform/
├── backend/
│   ├── db/connection.js       # MySQL pool
│   ├── routes/
│   │   ├── students.js        # /api/students/*
│   │   ├── teachers.js        # /api/teachers/*
│   │   └── admin.js           # /api/admin/* + /api/admin/quizzes/*
│   ├── server.js              # Express entry point
│   ├── .env                   # DB credentials (edit this)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/index.js        # All Axios calls
    │   ├── context/AuthContext.jsx
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   └── UI.jsx          # Badge, Card, MetricCard, ProgressBar…
    │   └── pages/
    │       ├── Login.jsx
    │       ├── student/
    │       │   ├── Dashboard.jsx
    │       │   └── Results.jsx
    │       ├── teacher/
    │       │   ├── Dashboard.jsx
    │       │   └── Submissions.jsx
    │       └── admin/
    │           ├── Dashboard.jsx
    │           └── Students.jsx
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## Setup — Step by Step

### 1. Make sure your MySQL DB is running
Open MySQL Workbench and confirm `ai_learning_platform` exists with all 12 tables populated.

### 2. Configure backend
```bash
cd backend
```
Edit `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ai_learning_platform
PORT=5000
```

Install dependencies and start:
```bash
npm install
npm run dev        # uses nodemon for auto-reload
# OR
npm start          # plain node
```

Backend runs at: http://localhost:5000
Test it: http://localhost:5000/api/health

### 3. Configure frontend
```bash
cd frontend
npm install
npm start
```

Frontend runs at: http://localhost:3000
The `"proxy": "http://localhost:5000"` in package.json forwards all `/api/*` calls to the backend automatically — no CORS issues.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Server health check |
| GET | /api/students | All active students |
| GET | /api/students/:id/enrollments | Student's courses + progress |
| GET | /api/students/:id/assignments | Student's assignments + grades |
| GET | /api/students/:id/progress | Topic-level progress + AI suggestions |
| GET | /api/students/:id/results | Graded results |
| GET | /api/teachers | All active teachers |
| GET | /api/teachers/:id/courses | Teacher's courses with counts |
| GET | /api/teachers/:id/submissions | All submissions for teacher's courses |
| GET | /api/teachers/:id/performance/:courseId | Avg score per topic |
| GET | /api/teachers/:id/ai-content | AI content for approval |
| PATCH | /api/teachers/ai-content/:id/approve | Approve AI content |
| POST | /api/teachers/grade | Submit/update a grade |
| GET | /api/admin/stats | Platform-wide counts + grade distribution |
| GET | /api/admin/courses | All courses with teacher + enrollment info |
| GET | /api/admin/activity | Recent submissions + enrollments feed |
| GET | /api/admin/quizzes/:courseId | Quizzes with questions for a course |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Database | MySQL (`ai_learning_platform`) |
| Backend | Node.js + Express + mysql2 |
| Frontend | React 18 + React Router v6 |
| Styling | Tailwind CSS + DM Sans font |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP client | Axios |

---

## Demo Login

On the login page, pick a role — no password needed:
- **Student** → Arjun Kumar (student_id = 1)
- **Teacher** → Dr. Riya Sharma (teacher_id = 1)
- **Admin** → Platform-wide overview
