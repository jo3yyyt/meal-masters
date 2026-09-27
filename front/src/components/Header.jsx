import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../state/UserContext";
import { mockLogin, mockSignup } from "../services/authService";

export default function Header() {
  const { user, loginLocal, logout } = useUser();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  async function submit(kind) {
    setErr(""); setLoading(true);
    try {
      const fn = kind === "login" ? mockLogin : mockSignup;
      const { user: u, token } = await fn(email.trim(), pw);
      loginLocal({ ...u, token, authed: true });
      setEmail(""); setPw("");
    } catch (e) {
      setErr(e.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="brand">Meal Masters</div>

        {!user && (
          <>
            <div className="h-field">
              <input
                className="h-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e=>setEmail(e.target.value)}
              />
            </div>
            <div className="h-field">
              <input
                className="h-input"
                type="password"
                placeholder="Password (≥ 6)"
                value={pw}
                onChange={e=>setPw(e.target.value)}
              />
            </div>
            <button className="h-btn h-btn--primary" disabled={loading} onClick={()=>submit("login")}>
              {loading ? "…" : "Login"}
            </button>
            <button className="h-btn h-btn--ghost" disabled={loading} onClick={()=>submit("signup")}>
              {loading ? "…" : "Sign up"}
            </button>
            {err && <span className="h-error">{err}</span>}
          </>
        )}

        {user && (
          <div className="avatar-wrap" ref={menuRef}>
            <img
              className="avatar"
              src={user.avatarUrl || "https://api.dicebear.com/8.x/identicon/svg?seed=" + encodeURIComponent(user.email)}
              alt="profile"
              onClick={()=>setOpen(v=>!v)}
            />
            <span style={{color:"#9ca3af"}}>{user.email}</span>

            {open && (
              <div className="menu">
                <div style={{padding:"6px 10px", color:"#9ca3af"}}>Signed in</div>
                <a href="#" onClick={(e)=>e.preventDefault()}>My Profile (WIP)</a>
                <a href="#" onClick={(e)=>e.preventDefault()}>Saved Recipes (WIP)</a>
                <button onClick={logout}>Log out</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
