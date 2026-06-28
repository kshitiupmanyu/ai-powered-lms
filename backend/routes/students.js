const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET all students
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM students WHERE is_active = 1');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single student with enrollments
router.get('/:id', async (req, res) => {
  try {
    const [student] = await db.query('SELECT * FROM students WHERE student_id = ?', [req.params.id]);
    if (!student.length) return res.status(404).json({ error: 'Student not found' });
    res.json(student[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET student enrollments with course + progress info
router.get('/:id/enrollments', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.enrollment_id, e.status, e.enrollment_date,
             c.course_id, c.course_name, c.course_code, c.difficulty_level,
             t.full_name AS teacher_name,
             COUNT(DISTINCT sp.topic_id) AS completed_topics,
             (SELECT COUNT(*) FROM topics t2 WHERE t2.course_id = c.course_id) AS total_topics
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      JOIN teachers t ON c.teacher_id = t.teacher_id
      LEFT JOIN student_progress sp ON sp.student_id = e.student_id
        AND sp.course_id = c.course_id AND sp.is_completed = 1
      WHERE e.student_id = ?
      GROUP BY e.enrollment_id, c.course_id
    `, [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET student assignments
router.get('/:id/assignments', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.assignment_id, a.title, a.due_date, a.total_marks,
             c.course_name, c.course_code,
             sub.status AS submission_status, sub.submitted_at,
             r.marks_obtained, r.grade
      FROM enrollments e
      JOIN assignments a ON a.course_id = e.course_id
      JOIN courses c ON c.course_id = a.course_id
      LEFT JOIN submissions sub ON sub.assignment_id = a.assignment_id AND sub.student_id = e.student_id
      LEFT JOIN results r ON r.submission_id = sub.submission_id
      WHERE e.student_id = ?
      ORDER BY a.due_date ASC
    `, [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET student progress with AI suggestions
router.get('/:id/progress', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT sp.*, t.topic_name, c.course_name, c.course_code
      FROM student_progress sp
      JOIN topics t ON sp.topic_id = t.topic_id
      JOIN courses c ON sp.course_id = c.course_id
      WHERE sp.student_id = ?
      ORDER BY sp.last_accessed DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET student results
router.get('/:id/results', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, a.title AS assignment_title, c.course_name
      FROM results r
      JOIN assignments a ON r.assignment_id = a.assignment_id
      JOIN courses c ON a.course_id = c.course_id
      WHERE r.student_id = ?
      ORDER BY r.graded_at DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
