const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// =======================
// ➕ SUBMIT ASSIGNMENT (Student)
// =======================
router.post("/", async (req, res) => {
  const { assignment_id, student_id, content } = req.body;

  try {
    await db.query(
      `INSERT INTO submissions 
      (assignment_id, student_id, remarks, status)
      VALUES (?, ?, ?, ?)`,
      [
        assignment_id,
        student_id,
        content,        // storing student answer in remarks (temporary)
        "Submitted"
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.log("SUBMISSION ERROR:", err);
    res.json({ success: false });
  }
});


// =======================
// 📥 GET SUBMISSIONS (Teacher)
// =======================
router.get("/:teacherId", async (req, res) => {
  try {
   const [rows] = await db.query(`
  SELECT 
    s.submission_id,
    s.remarks AS content,
    s.submitted_at,
    s.marks,
    s.remarks,
    s.status,
    a.title AS assignment_title,
    c.course_name,
    st.full_name AS student_name   -- ✅ FIXED
  FROM submissions s
  JOIN assignments a ON s.assignment_id = a.assignment_id
  JOIN courses c ON a.course_id = c.course_id
  JOIN students st ON s.student_id = st.student_id
  ORDER BY s.submitted_at DESC
`);
    res.json(rows);
  } catch (err) {
    console.log("FETCH SUBMISSIONS ERROR:", err);
    res.json([]);
  }
});


// =======================
// 📝 UPDATE GRADE (Teacher)
// =======================
// =======================
// 📝 UPDATE GRADE (Teacher)
// =======================
router.post("/grade", async (req, res) => {
  const { submission_id, marks, remarks } = req.body; // ✅ no grade

  try {
    await db.query(
      `UPDATE submissions 
       SET marks = ?, remarks = ?
       WHERE submission_id = ?`,
      [marks, remarks, submission_id]
    );

    res.json({ success: true });
  } catch (err) {
    console.log("SUBMIT ERROR:", err);
    res.json({ success: false });
  }
});

module.exports = router;