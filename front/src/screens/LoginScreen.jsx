import React, { useState } from "react";
import { loginUser } from "../services/authService";
import "./style.css";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginUser(username, pw);
    if (success) {
      alert("Login successful!");
      window.location.hash = "#/home";
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Enter your password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p className="signup">
          Don’t have an account? <a href="#/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}
