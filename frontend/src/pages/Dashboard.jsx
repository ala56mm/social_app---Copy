import React, { useState, useEffect } from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";
import CreatePost from "../components/CreatePost";
import PostFeed from "../components/PostFeed";

function Dashboard({ user }) {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/posts");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Grid container spacing={3}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Your Feed</Typography>
            <Typography variant="body2">{user?.username}</Typography>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={6}>
          <CreatePost user={user} refreshPosts={fetchPosts} />
          <PostFeed posts={posts} refreshPosts={fetchPosts} />
        </Grid>

        {/* Right Sidebar (Profile Info) */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Profile</Typography>
            <Typography variant="body2">{user?.username}</Typography>
            <Typography variant="body2">{user?.email}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
