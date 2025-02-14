import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/${postId}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/posts/${postId}/comments`, {
        user_id: 1,  // 🔥 Replace this with the actual logged-in user's ID
        content: newComment
      });
  
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <Box sx={{ mt: 2 }}>
      {comments.map((comment) => (
        <Typography key={comment.id} variant="body2" sx={{ mt: 1 }}>
          <strong>{comment.username}:</strong> {comment.content}
        </Typography>
      ))}
      <form onSubmit={handleCommentSubmit}>
        <TextField value={newComment} onChange={(e) => setNewComment(e.target.value)} fullWidth label="Write a comment" />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>Comment</Button>
      </form>
    </Box>
  );
}

export default CommentSection;
