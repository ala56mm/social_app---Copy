const express = require("express");
const bcrypt = require("bcryptjs"); // Make sure it's declared only once
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Check if email already exists
    const checkUserQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkUserQuery, [email], async (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.length > 0) {
        return res.status(400).json({ error: "Email already exists!" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into database
      const insertUserQuery = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
      db.query(insertUserQuery, [username, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Failed to register user" });
        }

        res.status(201).json({ message: "User registered successfully!" });
      });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: "Error checking password" });

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT Token
      const token = jwt.sign({ userId: user.id, username: user.username }, "your_secret_key", { expiresIn: "1h" });

      res.json({ message: "Login successful", token, user });
    });
  });
});


module.exports = router;
