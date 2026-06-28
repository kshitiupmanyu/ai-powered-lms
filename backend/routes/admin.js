const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// ─── ADMIN ────────────────────────────────────────────────
// GET platform-wide stats
router.get('/stats', async (req, res) => {
  try {
    const [[students]] = await db.query('SELECT COUNT(*) AS total FROM students WHERE is_active=1');
    const [[teachers]] = await db.query('SELECT COUNT(*) AS total FROM teachers WHERE is_active=1');
    const [[courses]] = await db.query('SELECT COUNT(*) AS total FROM courses WHERE is_active=1');
    const [[enrollments]] = await db.query('SELECT COUNT(*) AS total FROM enrollments');
    const [[submissions]] = await db.query('SELECT COUNT(*) AS total FROM submissions');
    const [[quizzes]] = await db.query('SELECT COUNT(*) AS total FROM quizzes');
    const [gradeDistrib] = await db.query(`
      SELECT grade, COUNT(*) AS count FROM results GROUP BY grade ORDER BY grade
    `);
    res.json({
      students: students.total,
      teachers: teachers.total,
      courses: courses.total,
      enrollments: enrollments.total,
      submissions: submissions.total,
      quizzes: quizzes.total,
      gradeDistribution: gradeDistrib
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all courses with teacher + enrollment counts
router.get('/courses', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, t.full_name AS teacher_name, t.department,
             COUNT(DISTINCT e.student_id) AS enrolled_students
      FROM courses c
      JOIN teachers t ON c.teacher_id = t.teacher_id
      LEFT JOIN enrollments e ON e.course_id = c.course_id
      GROUP BY c.course_id
      ORDER BY c.course_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET recent activity feed
router.get('/activity', async (req, res) => {
  try {
    const [recentSubmissions] = await db.query(`
      SELECT 'submission' AS type, CONCAT(s.full_name, ' submitted ', a.title) AS message,
             sub.submitted_at AS timestamp, sub.status
      FROM submissions sub
      JOIN students s ON sub.student_id = s.student_id
      JOIN assignments a ON sub.assignment_id = a.assignment_id
      ORDER BY sub.submitted_at DESC LIMIT 5
    `);
    const [recentEnrollments] = await db.query(`
      SELECT 'enrollment' AS type, CONCAT(s.full_name, ' enrolled in ', c.course_name) AS message,
             e.enrollment_date AS timestamp, e.status
      FROM enrollments e
      JOIN students s ON e.student_id = s.student_id
      JOIN courses c ON e.course_id = c.course_id
      ORDER BY e.enrollment_date DESC LIMIT 5
    `);
    const combined = [...recentSubmissions, ...recentEnrollments]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 8);
    res.json(combined);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── QUIZZES ──────────────────────────────────────────────
// GET quizzes for a course with questions
router.get('/quizzes/:courseId', async (req, res) => {
  try {
    const [quizzes] = await db.query(
      'SELECT * FROM quizzes WHERE course_id = ?', [req.params.courseId]
    );
    for (const quiz of quizzes) {
      const [questions] = await db.query(
        'SELECT * FROM quiz_questions WHERE quiz_id = ?', [quiz.quiz_id]
      );
      quiz.questions = questions;
    }
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
