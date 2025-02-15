import React from "react";
import { Paper, Typography, Box, Avatar } from "@mui/material";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

// Function to generate a unique color for each user
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

function PostFeed({ posts, refreshPosts, currentUser }) {
  return (
    <Box sx={{ mt: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {posts.map((post) => (
        <Paper
          key={post.id}
          sx={{
            p: 3,
            mb: 2,
            width: "100%",
            maxWidth: "600px",
            borderRadius: "12px",
            boxShadow: 3,
            bgcolor: "#fff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Avatar
              src={post.avatar ? `http://localhost:5000${post.avatar}` : null}
              alt={post.username}
              sx={{
                mr: 2,
                bgcolor: post.avatar ? "transparent" : stringToColor(post.username),
              }}
            >
              {!post.avatar && post.username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
              {post.username}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mt: 1, color: "#555" }}>
            {post.content}
          </Typography>

          {post.image && (
            <Box
              component="img"
              src={`http://localhost:5000${post.image}`}
              alt="Post"
              sx={{
                width: "100%",
                borderRadius: "8px",
                mt: 2,
                objectFit: "cover",
                maxHeight: "500px",
              }}
            />
          )}

          {/* Like Button */}
          <LikeButton postId={post.id} userId={currentUser?.id} refreshPosts={refreshPosts} />

          {/* Comment Section */}
          <CommentSection postId={post.id} />
        </Paper>
      ))}
    </Box>
  );
}

export default PostFeed;
