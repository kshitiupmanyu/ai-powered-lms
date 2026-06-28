const express = require("express");
const router = express.Router();

let history = [];

router.post("/", (req, res) => {
  history.push(req.body);
  res.json({ message: "Progress saved" });
});

router.get("/", (req, res) => {
  res.json(history);
});

module.exports = router;