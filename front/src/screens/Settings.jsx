import React, { useEffect, useState } from "react";
import {
  Home,
  Bookmark,
  CalendarDays,
  ListTodo,
  UserCog,
  LogOut,
  Settings as SettingsIcon,
  Sun,
  Moon,
  SlidersHorizontal,
  Wand2,
} from "lucide-react";

export default function AppSettings() {
  const [theme, setThemeState] = useState("light");
  const [scale, setScale] = useState(100);

  // --- helpers ---
  const setTheme = (t) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem("mm_theme", t);
    } catch {}
  };

  const applyScale = (v) => {
    const ratio = Number(v) / 100;
    document.documentElement.style.setProperty("--ui-scale", String(ratio));
    try {
      localStorage.setItem("mm_scale", String(v));
    } catch {}
  };

  const handleScale = (e) => {
    const v = Number(e.target.value || 100);
    setScale(v);
    applyScale(v);
  };

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("mm_theme");
      const savedScale = localStorage.getItem("mm_scale");
      if (savedTheme) {
        setThemeState(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
      if (savedScale) {
        const v = Number(savedScale);
        setScale(v);
        applyScale(v);
      } else {
        applyScale(100);
      }
    } catch {
      document.documentElement.setAttribute("data-theme", "light");
      applyScale(100);
    }
  }, []);

  const restoreDefaults = () => {
    setTheme("light");     
    setScale(100);
    applyScale(100);
  };

  return (
    <div className="mm-app">
      {/* Sidebar */}
      <aside className="mm-sidebar">
        <div className="mm-sidebar-header">
          <div className="mm-title" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <SettingsIcon size={20} />
            Settings
          </div>
          <div className="mm-subtitle">Appearance & app controls</div>
        </div>

        <div className="mm-sidebar-actions">
          <button className="mm-sidebar-btn" onClick={() => (window.location.hash = "/home")}>
            <Home size={18} /> <span>Home</span>
          </button>
          <button className="mm-sidebar-btn" onClick={() => (window.location.hash = "/saved")}>
            <Bookmark size={18} /> <span>Saved for later</span>
          </button>
          <button className="mm-sidebar-btn" onClick={() => (window.location.hash = "/meal-planner")}>
            <CalendarDays size={18} /> <span>Meal Planner</span>
          </button>
          <button className="mm-sidebar-btn" onClick={() => (window.location.hash = "/my-meal-plan")}>
            <ListTodo size={18} /> <span>My Meal Plan</span>
          </button>
          <button className="mm-sidebar-btn" onClick={() => (window.location.hash = "/profile-setup")}>
            <UserCog size={18} /> <span>Profile Setup</span>
          </button>
          <button className="mm-sidebar-btn mm-sidebar-btn-active" onClick={() => (window.location.hash = "/settings")}>
            <SettingsIcon size={18} /> <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="mm-content">
        <div className="mm-container">
          <div className="settings-grid">
            {/* Theme */}
            <section className="mm-card">
              <h3 style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 0 }}>
                <Sun size={16} />
                Theme
              </h3>
              <label style={{ display: "flex", gap: 12, marginTop: 8, alignItems: "center" }}>
                <input
                  type="radio"
                  name="theme"
                  checked={theme === "light"}
                  onChange={() => setTheme("light")}
                />
                Light
              </label>

              <label style={{ display: "flex", gap: 12, marginTop: 6, alignItems: "center" }}>
                <input
                  type="radio"
                  name="theme"
                  checked={theme === "dark"}
                  onChange={() => setTheme("dark")}
                />
                Dark
              </label>
            </section>

            {/* UI size */}
            <section className="mm-card">
              <h3 style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 0 }}>
                <SlidersHorizontal size={16} />
                UI size
              </h3>
              <input
                type="range"
                min="75"
                max="125"
                step="5"
                value={scale}
                onChange={handleScale}
                style={{ width: "100%", marginTop: 10 }}
                aria-label="UI scale"
              />
              <div style={{ fontWeight: 700, marginTop: 6 }}>{scale}%</div>
              <small className="muted">Scale text + layout to fit screen.</small>
            </section>

            {/* Quick actions */}
            <section className="mm-card">
              <h3 style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 0 }}>
                <Wand2 size={16} />
                Quick actions
              </h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="mm-secondary" onClick={restoreDefaults}>
                  Restore defaults
                </button>
              </div>
              <small className="muted">Resets to back to defult.</small>
            </section>

            {/* Account */}
            <section className="mm-card">
              <h3 style={{ marginTop: 0 }}>Account</h3>
              <button
                className="mm-primary"
                onClick={() => (window.location.hash = "/login")}
                style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}
              >
                <LogOut size={16} />
                Log Out
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
