import React, { useState } from "react";
import { signupUser } from "../services/authService";
import "./style.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await signupUser(username, pw);
    setLoading(false);
    if (ok) {
      // set once right after successful signup
localStorage.setItem("justSignedUp", "1");
window.location.hash = "/profile-setup";

    } else {
      alert("Signup failed. Try a different username or check server.");
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Sign Up</h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Create a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Create a password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
            autoComplete="new-password"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Sign Up"}
          </button>
        </form>

        <p className="muted">
          Already have an account?{" "}
          <a href="#/login">Login</a>
        </p>
      </div>
    </div>
  );
}
