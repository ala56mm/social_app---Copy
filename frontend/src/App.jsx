import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [user, setUser] = useState(null);

  // Fetch the logged-in user when the app loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true });
        console.log("🔍 Debug - Fetched User:", res.data);
        setUser(res.data);
      } catch (error) {
        console.error("🚨 Error fetching user:", error.response?.data || error.message);
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        {/* Pass user as currentUser to Home */}
        <Route path="/" element={<Home currentUser={user} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
