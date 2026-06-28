const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET all teachers
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM teachers WHERE is_active = 1');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET teacher courses with student count
router.get('/:id/courses', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*,
             COUNT(DISTINCT e.student_id) AS student_count,
             COUNT(DISTINCT q.quiz_id) AS quiz_count,
             COUNT(DISTINCT a.assignment_id) AS assignment_count
      FROM courses c
      LEFT JOIN enrollments e ON e.course_id = c.course_id AND e.status = 'Active'
      LEFT JOIN quizzes q ON q.course_id = c.course_id
      LEFT JOIN assignments a ON a.course_id = c.course_id
      WHERE c.teacher_id = ?
      GROUP BY c.course_id
    `, [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET pending submissions for teacher's courses
router.get('/:id/submissions', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT sub.submission_id, sub.submitted_at, sub.status AS submission_status,
             s.full_name AS student_name, s.student_id,
             a.title AS assignment_title, a.total_marks, a.due_date,
             c.course_name, c.course_code,
             r.marks_obtained, r.grade, r.feedback
      FROM submissions sub
      JOIN students s ON sub.student_id = s.student_id
      JOIN assignments a ON sub.assignment_id = a.assignment_id
      JOIN courses c ON a.course_id = c.course_id
      LEFT JOIN results r ON r.submission_id = sub.submission_id
      WHERE c.teacher_id = ?
      ORDER BY sub.submitted_at DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET class performance per topic for a course
router.get('/:id/performance/:courseId', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.topic_name,
             COUNT(sp.student_id) AS attempted,
             ROUND(AVG(sp.score), 1) AS avg_score,
             SUM(CASE WHEN sp.is_completed = 1 THEN 1 ELSE 0 END) AS completed_count
      FROM topics t
      LEFT JOIN student_progress sp ON sp.topic_id = t.topic_id
      WHERE t.course_id = ?
      GROUP BY t.topic_id
      ORDER BY t.order_number
    `, [req.params.courseId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET AI content pending approval for teacher's courses
router.get('/:id/ai-content', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ai.content_id, ai.content_type, ai.content_text,
             ai.generated_at, ai.is_approved,
             t.topic_name, c.course_name, c.course_code
      FROM ai_generated_content ai
      JOIN topics t ON ai.topic_id = t.topic_id
      JOIN courses c ON t.course_id = c.course_id
      WHERE c.teacher_id = ?
      ORDER BY ai.generated_at DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH approve AI content
router.patch('/ai-content/:contentId/approve', async (req, res) => {
  try {
    await db.query('UPDATE ai_generated_content SET is_approved = 1 WHERE content_id = ?', [req.params.contentId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST grade a submission
router.post('/grade', async (req, res) => {
  try {
    const { submission_id, student_id, assignment_id, marks_obtained, total_marks, grade, feedback } = req.body;
    await db.query(`
      INSERT INTO results (submission_id, student_id, assignment_id, marks_obtained, total_marks, grade, feedback, graded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE marks_obtained=?, grade=?, feedback=?, graded_at=NOW()
    `, [submission_id, student_id, assignment_id, marks_obtained, total_marks, grade, feedback, marks_obtained, grade, feedback]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
