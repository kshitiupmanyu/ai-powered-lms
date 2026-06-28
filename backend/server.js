const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/students', require('./routes/students'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/admin',    require('./routes/admin'));
app.use('/api/ai',       require('./routes/ai'));

const quizRoutes = require("./routes/quiz");
app.use("/api/quiz", quizRoutes);

const weakRoutes = require("./routes/weak");
app.use("/api/quiz/weak", weakRoutes);

// ✅ ADD THIS (STEP 2)
const progressRoutes = require("./routes/progress");
app.use("/api/progress", progressRoutes);
// 🔥 FORCE LOAD + DEBUG
const studyRoutes = require("./routes/study");
console.log("Study route type:", typeof studyRoutes);

app.use("/api/study", studyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: process.env.DB_NAME });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const courseRoutes = require("./routes/courses");
app.use("/api/courses", courseRoutes);

const assignmentRoutes = require("./routes/assignments");
app.use("/api/assignments", assignmentRoutes);

const submissionRoutes = require("./routes/submissions");
app.use("/api/submissions", submissionRoutes);
