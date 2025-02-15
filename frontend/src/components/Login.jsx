import React, { useState } from "react";
import { TextField, Button, Container, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setUser }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, mt: 5 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField 
            label="Email" 
            name="email" 
            fullWidth 
            margin="normal" 
            value={formData.email} 
            onChange={handleChange} 
          />
          <TextField 
            label="Password" 
            name="password" 
            type="password" 
            fullWidth 
            margin="normal" 
            value={formData.password} 
            onChange={handleChange} 
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Login</Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;
