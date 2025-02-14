import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import PostFeed from "../components/PostFeed";
import CreatePost from "../components/CreatePost";

function Home({ currentUser }) {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);


  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      {!currentUser ? (
        <>
          <Typography variant="h3" gutterBottom>Welcome to Social App</Typography>
          <Typography variant="h6" gutterBottom>Connect, share, and engage with your community.</Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" component={Link} to="/login" sx={{ mr: 2 }}>Login</Button>
            <Button variant="outlined" component={Link} to="/register">Register</Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>Welcome, {currentUser.username}!</Typography>
          <CreatePost user={currentUser} refreshPosts={fetchPosts} />
          {/* Post Feed Section - Place PostFeed here */}
          <PostFeed posts={posts} refreshPosts={fetchPosts} currentUser={currentUser} />
        </>
      )}
    </Container>
  );
}

export default Home;
