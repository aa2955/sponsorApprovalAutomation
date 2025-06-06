import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Login.css";

import Navbar from "./Navbar";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", formData);
      const user = res.data.user;
  
      localStorage.setItem("user", JSON.stringify(user));
      setError("");
      setSuccess("Login successful!");
  
      // ✅ Redirect to homepage after successful login
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.error || "Login failed");
      setSuccess("");
    }
  };
  

  return (
    <>
      <Navbar currentPage={'login'}/>

      <div className="login page">
        <h2>Login</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          /><br />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          /><br />
          <button type="submit">Login</button>
          {success && <p style={{ color: "green" }}>{success}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        <br/>
        <span className="suggestion">Don't have an account? <Link to='/signup'>Sign Up Here</Link></span>
      </div>
    </>
  );
}
