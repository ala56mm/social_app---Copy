import React, { useState } from "react";
import axios from "axios";
import { IconButton, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

function LikeButton({ postId, userId, refreshPosts }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const handleLike = async () => {
    if (!userId) {
      console.error("❌ Error: User ID is required to like a post.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/like`, { userId });

      setLiked(response.data.liked);
      setLikes(response.data.likes);
      refreshPosts();  // Refresh posts after like
    } catch (error) {
      console.error("❌ Error liking post:", error.message);
    }
  };

  return (
    <IconButton onClick={handleLike} color={liked ? "primary" : "default"}>
      <FavoriteIcon />
      <Typography>{likes}</Typography>
    </IconButton>
  );
}

export default LikeButton;
