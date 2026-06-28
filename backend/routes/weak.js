const express = require("express");
const router = express.Router();

let weakTopics = [];

router.post("/", (req, res) => {
  weakTopics = req.body.weakTopics;
  res.json({ message: "Weak topics stored" });
});

router.get("/", (req, res) => {
  res.json({ weakTopics });
});

module.exports = router;