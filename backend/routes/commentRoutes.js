const express = require("express");
const db = require("../db");
const router = express.Router();

router.post("/", (req, res) => {
  const { postId, userId, comment } = req.body;

  db.query("INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)",
    [postId, userId, comment], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.status(201).json({ message: "Comment added" });
    }
  );
});

router.get("/:postId", (req, res) => {
  const postId = req.params.postId;

  db.query("SELECT * FROM comments WHERE post_id = ?", [postId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

module.exports = router;
