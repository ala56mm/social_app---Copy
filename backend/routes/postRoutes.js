const express = require("express");
const db = require("../db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/* ================================
✅ CREATE A POST (With Image Upload)
================================ */
router.post("/", upload.single("image"), (req, res) => {
  const { user_id, content } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!user_id || !content) {
    return res.status(400).json({ error: "User ID and content are required" });
  }

  const query = "INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)";
  db.query(query, [user_id, content, image], (err, result) => {
    if (err) {
      console.error("🔴 Database Error:", err.sqlMessage);
      return res.status(500).json({ error: err.sqlMessage });
    }
    res.status(201).json({ message: "Post created successfully", postId: result.insertId });
  });
});

/* ================================
✅ FETCH ALL POSTS (Include Username)
================================ */
router.get("/", (req, res) => {
  const query = `
    SELECT p.*, u.username 
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    ORDER BY p.created_at DESC`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching posts:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

/* ================================
✅ FETCH A SINGLE POST BY ID
================================ */
router.get("/:id", (req, res) => {
  const postId = req.params.id;
  db.query("SELECT * FROM posts WHERE id = ?", [postId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = results[0];
    post.image = post.image ? `http://localhost:5000/${post.image}` : null;
    res.json(post);
  });
});

/* ================================
✅ LIKE / UNLIKE A POST
================================ */
router.post("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Check if the user has already liked the post
    const [likes] = await db.promise().query(
      "SELECT * FROM likes WHERE post_id = ? AND user_id = ?",
      [postId, userId]
    );

    let liked = false;
    let likeCount = 0;

    if (likes.length > 0) {
      // If already liked, remove the like
      await db.promise().query("DELETE FROM likes WHERE post_id = ? AND user_id = ?", [postId, userId]);
      await db.promise().query("UPDATE posts SET likes = likes - 1 WHERE id = ?", [postId]);
    } else {
      // If not liked, add the like
      await db.promise().query("INSERT INTO likes (post_id, user_id) VALUES (?, ?)", [postId, userId]);
      await db.promise().query("UPDATE posts SET likes = likes + 1 WHERE id = ?", [postId]);
      liked = true;
    }

    // Get updated like count
    const [updatedPost] = await db.promise().query("SELECT likes FROM posts WHERE id = ?", [postId]);
    likeCount = updatedPost[0].likes;

    return res.json({ message: liked ? "Post liked" : "Post unliked", liked, likeCount });

  } catch (error) {
    console.error("❌ Database Error:", error);
    res.status(500).json({ error: "Failed to process like request" });
  }
});

/* ================================
✅ FETCH COMMENTS FOR A POST
================================ */
router.get("/:postId/comments", (req, res) => {
  const postId = req.params.postId;

  db.query(
    `SELECT c.id, c.content, c.created_at, u.username 
     FROM comments c 
     JOIN users u ON c.user_id = u.id 
     WHERE c.post_id = ? 
     ORDER BY c.created_at ASC`,
    [postId],
    (err, results) => {
      if (err) {
        console.error("Error fetching comments:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    }
  );
});

/* ================================
✅ ADD A COMMENT TO A POST
================================ */
router.post("/:postId/comments", (req, res) => {
  const { user_id, content } = req.body;
  const postId = req.params.postId;

  if (!user_id || !content) {
    return res.status(400).json({ error: "User ID and comment content are required" });
  }

  const query = "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)";
  db.query(query, [postId, user_id, content], (err, result) => {
    if (err) {
      console.error("Error adding comment:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Comment added successfully", commentId: result.insertId });
  });
});

/* ================================
✅ DELETE A POST
================================ */
router.delete("/:postId", (req, res) => {
  const postId = req.params.postId;

  db.query("DELETE FROM posts WHERE id = ?", [postId], (err, result) => {
    if (err) {
      console.error("Error deleting post:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Post deleted successfully" });
  });
});

module.exports = router;
