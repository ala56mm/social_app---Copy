import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

function PostFeed({ posts, refreshPosts, currentUser }) {  return (
    <Box sx={{ mt: 3 }}>
      {posts.map((post) => (
        <Paper key={post.id} sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6">{post.username}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>{post.content}</Typography>
          {post.image && (
              <img
               src={`http://localhost:5000/uploads/${post.image}`}
                 alt="Post"
                 width="100%"
                  // onError={(e) => e.target.style.display = "none"}
                 />
                )}
          

          <LikeButton postId={post.id} userId={currentUser?.id} refreshPosts={refreshPosts} />
          <CommentSection postId={post.id} />
        </Paper>
      ))}
    </Box>
  );
}

export default PostFeed;
