const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// ✅ GET ALL COURSES
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM courses");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.json([]);
  }
});

// ✅ ENROLL COURSE
router.post("/enroll", async (req, res) => {
  const { student_id, course_id } = req.body;

  try {
    const [existing] = await db.query(
      "SELECT * FROM enrollments WHERE student_id=? AND course_id=?",
      [student_id, course_id]
    );

    if (existing.length > 0) {
      return res.json({
        success: false,
        message: "Already enrolled",
      });
    }

    await db.query(
      "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)",
      [student_id, course_id]
    );

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

module.exports = router;