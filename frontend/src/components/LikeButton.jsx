import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axios from "axios";

function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const handleLike = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikes((prevLikes) => (newLikedState ? prevLikes + 1 : prevLikes - 1));

    try {
        const response = await axios.post(`http://localhost:5000/api/posts/${postId}/like`, { userId });
        console.log("✅ Like response:", response.data);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <IconButton onClick={handleLike} color="primary">
        {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      </IconButton>
      <Typography variant="body2">{likes} Likes</Typography>
    </div>
  );
}

export default LikeButton;
