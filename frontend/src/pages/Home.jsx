import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import PostFeed from "../components/PostFeed";
import CreatePost from "../components/CreatePost";
import Slider from "react-slick"; // 👈 Import react-slick
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

function Home({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [carouselImages, setCarouselImages] = useState([
    "./src/assets/p1.jpg",
   "./src/assets/p2.png",
   "./src/assets/p3.jpg"
  ]);

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

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      {/* Carousel Section */}
      <Box sx={{ width: "500%", maxWidth: "1000px", margin: "auto", mb: 5 }}>
        <Slider {...carouselSettings}>
          {carouselImages.map((image, index) => (
            <Box key={index} component="img" src={image} alt={`Banner ${index + 1}`} 
              sx={{ width: "300%", height: "500px", objectFit: "cover", borderRadius: "10px" }} 
            />
          ))}
        </Slider>
      </Box>

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
          <PostFeed posts={posts} refreshPosts={fetchPosts} currentUser={currentUser} />
        </>
      )}
    </Container>
  );
}

export default Home;
