const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// ============================
// 📥 GET ASSIGNMENTS FOR STUDENT
// ============================
router.get("/:studentId", async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const [rows] = await db.query(`
      SELECT 
        a.assignment_id,
        a.title,
        a.description,
        a.due_date,
        c.course_name
      FROM assignments a
      JOIN courses c ON a.course_id = c.course_id
      JOIN enrollments e ON e.course_id = a.course_id
      WHERE e.student_id = ?
    `, [studentId]);

    res.json(rows);
  } catch (err) {
    console.log("GET ASSIGNMENTS ERROR:", err);
    res.status(500).json([]);
  }
});


// ============================
// ➕ CREATE ASSIGNMENT (FIXED)
// ============================
router.post("/", async (req, res) => {
  const { course_id, teacher_id, title, description, due_date } = req.body;

  // basic validation
  if (!course_id || !teacher_id || !title || !due_date) {
    return res.json({ success: false, message: "Missing required fields" });
  }

  try {
    await db.query(
      `INSERT INTO assignments 
      (course_id, teacher_id, title, description, due_date) 
      VALUES (?, ?, ?, ?, ?)`,
      [course_id, teacher_id, title, description, due_date]
    );

    res.json({ success: true });
  } catch (err) {
    console.log("CREATE ASSIGNMENT ERROR:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;