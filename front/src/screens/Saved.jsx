import React, { useEffect, useState, useCallback } from "react";
import "./style.css";
import {
  UtensilsCrossed, Home, Bookmark, CalendarDays, ListTodo, UserCog, LogOut, BookmarkX, Settings
} from "lucide-react";

const SidebarButton = ({ icon: Icon, children, ...props }) => (
  <button {...props} className="mm-sidebar-btn">
    <Icon size={18} />
    <span>{children}</span>
  </button>
);

export default function Saved() {
  const [items, setItems] = useState([]);

  const readSaved = useCallback(() => {
    const raw = localStorage.getItem("savedRecipes");
    setItems(raw ? JSON.parse(raw) : []);
  }, []);

  useEffect(() => {
    readSaved();
    const onStorage = (e) => e.key === "savedRecipes" && readSaved();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [readSaved]);

  const removeOne = (id) => {
    const next = items.filter((x) => x.id !== id);
    setItems(next);
    localStorage.setItem("savedRecipes", JSON.stringify(next));
  };

  const clearAll = () => {
    setItems([]);
    localStorage.setItem("savedRecipes", JSON.stringify([]));
  };

  return (
    <div className="mm-app">
      {/* Sidebar */}
      <aside className="mm-sidebar">
        {/* Branded header */}
        <div className="mm-sidebar-header">
          <div className="mm-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <UtensilsCrossed size={20} />
            Meal Masters
          </div>
          <div className="mm-subtitle">Plan smart. Cook happy.</div>
        </div>

        <div className="mm-sidebar-actions">
          <SidebarButton icon={Home} onClick={() => (window.location.hash = "/home")}>Home</SidebarButton>
          <SidebarButton icon={Bookmark} className="mm-sidebar-btn-active" onClick={() => (window.location.hash = "/saved")}>Saved for later</SidebarButton>
          <SidebarButton icon={CalendarDays} onClick={() => (window.location.hash = "/meal-planner")}>Meal Planner</SidebarButton>
          <SidebarButton icon={ListTodo} onClick={() => (window.location.hash = "/my-meal-plan")}>My Meal Plan</SidebarButton>
          <SidebarButton icon={UserCog} onClick={() => (window.location.hash = "/profile-setup")}>Profile Setup</SidebarButton>
          <SidebarButton icon={Settings} onClick={() => (window.location.hash = "/settings")}>Settings</SidebarButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="mm-content">
        <div className="mm-container">
          <div className="mm-search" style={{ justifyContent: "space-between" }}>
          <h2>Saved for Later</h2>
<button
  className="btn-ghost saved-clear"
  onClick={clearAll}
  disabled={!items.length}
>
  Clear all
</button>
          </div>

          {items.length === 0 ? (
            <div className="saved-empty">
              <div className="saved-empty-card">
                <BookmarkX size={24} />
                <h3>No saved recipes yet</h3>
                <p>Go to Home and tap the bookmark to save recipes for later.</p>
                <button className="mm-primary" onClick={() => (window.location.hash = "/home")}>
                  Browse recipes
                </button>
              </div>
            </div>
          ) : (
            <section className="home-grid">
              {items.map((r) => (
                <article
                  key={r.id}
                  className="recipe-card mm-card-click"
                  onClick={() => (window.location.hash = `/recipe/${r.id}`)}
                >
                  <div className="recipe-thumb">
                    {r.imageUrl ? (
                      <img className="recipe-img" src={r.imageUrl} alt={r.title} />
                    ) : (
                      <div style={{ fontSize: 12, color: "#777" }}>No image</div>
                    )}
                  </div>

                  <div className="recipe-meta">
                    <h3 className="recipe-title">{r.title}</h3>
                    <p className="recipe-tag">Saved</p>
                  </div>

                  {/* remove button */}
                  <button
                    className="recipe-unsave-btn"
                    aria-label="Remove from saved"
                    onClick={(e) => { e.stopPropagation(); removeOne(r.id); }}
                    title="Remove"
                  >
                    <BookmarkX size={16} />
                  </button>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
