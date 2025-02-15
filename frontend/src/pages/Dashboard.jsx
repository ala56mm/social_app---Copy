import React, { useState, useEffect } from "react";
import { Container, Grid, Paper, Typography, Avatar, IconButton, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import CreatePost from "../components/CreatePost";
import PostFeed from "../components/PostFeed";

// Function to generate unique avatar colors
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

function Dashboard({ user }) {
  const [posts, setPosts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch posts
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

  // Toggle Dark Mode
  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Theme Config (Full-Screen Background Change)
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: { default: darkMode ? "#121212" : "#ffffff" },
      text: { primary: darkMode ? "#ffffff" : "#000000" }, // Text color changes based on theme
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {/* Full-Screen Background */}
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          bgcolor: "background.default",
          color: "text.primary",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Container>
          <Grid container spacing={3}>
            {/* Left Sidebar (Profile Section) */}
            <Grid item xs={12} md={3}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: "10px",
                  boxShadow: 3,
                  height: "350px", // Small profile card
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "background.paper",
                  color: "text.primary",
                }}
              >
                <Avatar
                  src={user?.avatar ? `http://localhost:5000${user.avatar}` : null}
                  alt={user?.username}
                  sx={{
                    width: 80,
                    height: 80,
                    fontSize: "2rem",
                    bgcolor: user?.avatar ? "transparent" : stringToColor(user?.username || "User"),
                    mb: 2,
                  }}
                >
                  {!user?.avatar && user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6">{user?.username}</Typography>
                <Typography variant="body2">{user?.email}</Typography>

                {/* Dark Mode Toggle Button */}
                <IconButton onClick={toggleTheme} sx={{ mt: 2, color: "text.primary" }}>
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Paper>
            </Grid>

            {/* Main Content (Posts) */}
            <Grid item xs={12} md={6}>
              <CreatePost user={user} refreshPosts={fetchPosts} />
              <PostFeed posts={posts} refreshPosts={fetchPosts} currentUser={user} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
