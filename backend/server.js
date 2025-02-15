require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const db = require("./db");
const path = require("path");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");


const app = express();

// Middleware
axios.get("http://localhost:5000/api/posts", { withCredentials: true })
  .then(response => console.log(response.data))
  .catch(error => console.error(error));

app.use(express.json()); // Replaces body-parser
// Serve "uploads" folder as static
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Test Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong! Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
