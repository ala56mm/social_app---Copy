import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Paper, Typography, Box, Alert } from "@mui/material";

function CreatePost({ user, refreshPosts }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Check if user is logged in
    if (!user || !user.id) {
      setError("User not found. Please log in.");
      return;
    }

    // ✅ Validate content
    if (!content.trim()) {
      setError("Post content cannot be empty.");
      return;
    }

    // ✅ Prepare FormData for image upload
    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("username", user.username);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      // ✅ Send post request with FormData
      const response = await axios.post("http://localhost:5000/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Post Created:", response.data);

      // ✅ Reset form
      setContent("");
      setImage(null);
      setError("");
      refreshPosts(); // Reload posts after creating new one
    } catch (err) {
      console.error("🔴 Error Creating Post:", err.response?.data?.error || err.message);
      setError(err.response?.data?.error || "Failed to create post.");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
      <Paper elevation={3} sx={{ padding: 3, width: 500 }}>
        <Typography variant="h6" gutterBottom>Create a Post</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="What's on your mind?"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setImage(e.target.files[0])} 
            style={{ marginTop: 10 }} 
          />

          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2 }} 
            type="submit"
          >
            Post
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default CreatePost;
