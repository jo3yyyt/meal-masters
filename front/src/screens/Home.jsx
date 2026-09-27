import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./style.css";
import {
  Bookmark, Coffee, UtensilsCrossed, Sandwich, Popcorn, UserCircle2, BookOpen, Settings, Timer, Home, LogOut, CalendarCheck2, ClipboardList,
} from "lucide-react";

/* --------- tiny helpers --------- */
const SidebarButton = ({ children, ...props }) => (
  <button {...props} className="mm-sidebar-btn">
    {children}
  </button>
);

const toTitle = (s = "") =>
  s.split(/[\s-]+/).map(w => (w ? w[0].toUpperCase() + w.slice(1) : "")).join(" ");

function normalizeList(data) {
  const raw = Array.isArray(data)
    ? data
    : Array.isArray(data?.results)
    ? data.results
    : [];
  return raw.map((r, i) => ({
    id: r.id ?? i,
    title: r.title || r.name || "Untitled",
    imageUrl: r.image || r.image_url || null,
    desc: (r.summary || r.description || "").replace(/<[^>]+>/g, ""),
    mins: r.readyInMinutes || r.total_time || r.time || null,
    tag: r.dishTypes?.[0] || r.cuisine || "Recipe",
  }));
}

const TOKEN = localStorage.getItem('token')
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function fetchList(mealType) {
  const url = `${API_URL}/recipe/recipeList/${mealType}`;
  try {
    const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    return normalizeList(data);
  } catch {
    return [];
  }
}

/* read profile from setup */
function readProfileFromLocalStorage() {
  try {
    const raw = localStorage.getItem("profile");
    const p = raw ? JSON.parse(raw) : null;
    if (!p) return { allergies: "", dietType: "", intolerances: [] };
    return {
      allergies: typeof p.allergies === "string" ? p.allergies : "",
      dietType: typeof p.dietType === "string" ? p.dietType : "",
      intolerances: Array.isArray(p.intolerances) ? p.intolerances : [],
    };
  } catch {
    return { allergies: "", dietType: "", intolerances: [] };
  }
}

/* ============== PAGE ============== */
export default function HomePage() {
  const [q, setQ] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [lists, setLists] = useState({ breakfast: [], lunch: [], dinner: [] });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [prefs, setPrefs] = useState(() => readProfileFromLocalStorage());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    console.log(localStorage.getItem('token'))
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const [b, l, d] = await Promise.all([
          fetchList("breakfast"),
          fetchList("main-course"),
          fetchList("dessert"),
        ]);
        if (!alive) return;
        setLists({ breakfast: b, lunch: l, dinner: d });
      } catch (e) {
        if (alive) setErr("Could not load recipes.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    const onStorage = (ev) => {
      if (ev.key === "profile") setPrefs(readProfileFromLocalStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => {
      alive = false;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) setPrefs(readProfileFromLocalStorage());
  }, [menuOpen]);

  const all = useMemo(
    () => [...lists.breakfast, ...lists.lunch, ...lists.dinner],
    [lists]
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const source =
      activeTab === "breakfast"
        ? lists.breakfast
        : activeTab === "lunch"
        ? lists.lunch
        : activeTab === "dinner"
        ? lists.dinner
        : all;
    if (!term) return source;
    return source.filter((r) =>
      (r.title || "").toLowerCase().includes(term)
    );
  }, [q, activeTab, lists, all]);

  const saveItem = async (item) => {
    if (!item) return;
    try {
      await axios.post(
        "${API_URL}/profile/saved",
        { recipeID: item.id, title: item.title },
        { headers: { Authorization: TOKEN } }
      );
      const current = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
      if (!current.some((r) => r.id === item.id)) {
        const next = [
          ...current,
          { id: item.id, title: item.title, desc: item.desc || "", imageUrl: item.imageUrl || "" },
        ];
        localStorage.setItem("savedRecipes", JSON.stringify(next));
      }
      alert(`${item.title} saved for later!`);
    } catch {
      alert("Failed to save recipe.");
    }
  };

  const dietLabel = prefs.dietType
    ? toTitle(prefs.dietType.replaceAll("-", " "))
    : "None";
  const intoleranceLabel =
    prefs.intolerances?.length
      ? prefs.intolerances
          .map((v) => toTitle(v.replaceAll("-", " ")))
          .join(", ")
      : "None";
  const allergiesLabel = prefs.allergies?.trim() ? prefs.allergies : "None";

  const TABS = [
    { key: "all", label: "All", icon: BookOpen },
    { key: "breakfast", label: "Breakfast", icon: Coffee },
    { key: "lunch", label: "Lunch", icon: Sandwich },
    { key: "dinner", label: "Dinner", icon: UtensilsCrossed },
  ];

  return (
    <div className="mm-app">
      {/* Sidebar */}
      <aside className="mm-sidebar">
        <div className="mm-sidebar-header">
          <div className="mm-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <UtensilsCrossed size={18} /> Meal Masters
          </div>
          <div className="mm-subtitle">Welcome back!</div>
        </div>

        <div className="mm-sidebar-actions">
          <SidebarButton className="mm-sidebar-btn-active" onClick={() => (window.location.hash = "/home")}>
            <Home size={18} /> Home
          </SidebarButton>
          <SidebarButton onClick={() => (window.location.hash = "/saved")}>
            <Bookmark size={18} /> Saved for later
          </SidebarButton>
          <SidebarButton onClick={() => (window.location.hash = "/meal-planner")}>
            <ClipboardList size={18} /> Meal Planner
          </SidebarButton>
          <SidebarButton onClick={() => (window.location.hash = "/my-meal-plan")}>
            <CalendarCheck2 size={18} /> My Meal Plan
          </SidebarButton>
          <SidebarButton onClick={() => (window.location.hash = "/profile-setup")}>
            <UserCircle2 size={18} /> Profile Setup
          </SidebarButton>
          <SidebarButton onClick={() => (window.location.hash = "/settings")}>
            <Settings size={18} /> Settings
          </SidebarButton>
        </div>
      </aside>

      {/* Content */}
      <main className="mm-content">
        <div className="mm-container home-wrap">
          <div className="home-bar">
            <div className="home-search">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Find the perfect recipe"
                aria-label="Search recipes"
              />
            </div>

            <div className="home-actions">
              <button
                className="home-btn primary"
                onClick={() => (window.location.hash = "/profile-setup")}
              >
                Edit Profile
              </button>

              <div className="profile-wrap">
                <button
                  className="avatar"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                  title="Your preferences"
                >
                  <UserCircle2 size={22} />
                </button>

                {menuOpen && (
                  <div className="profile-menu" role="menu">
                    <div className="pm-head">Your Preferences</div>
                    <div className="pm-row">
                      <span>Diet</span>
                      <b>{dietLabel}</b>
                    </div>
                    <div className="pm-row">
                      <span>Allergies</span>
                      <b style={{ maxWidth: 160, textAlign: "right" }}>{allergiesLabel}</b>
                    </div>
                    <div className="pm-row">
                      <span>Intolerances</span>
                      <b style={{ maxWidth: 160, textAlign: "right" }}>{intoleranceLabel}</b>
                    </div>
                    <div className="pm-actions">
                      <button
                        className="pm-btn"
                        onClick={() => (window.location.hash = "/profile-setup")}
                      >
                        Edit preferences
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="home-titleRow">
            <h1>
              Discover <span className="home-count">{filtered.length} recipes</span>
            </h1>
            <div className="home-ctrls">
              <button className="home-ctrl">Filter</button>
              <button className="home-ctrl">Sort</button>
              <button className="home-ctrl more" aria-label="More">
                ⋯
              </button>
            </div>
          </div>

          <div className="home-tabs" role="tablist" aria-label="Categories">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                role="tab"
                aria-selected={activeTab === key}
                className={`home-tab ${activeTab === key ? "is-active" : ""}`}
                onClick={() => setActiveTab(key)}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {loading && <p>Loading recipes…</p>}
          {!loading && err && <p style={{ color: "crimson" }}>{err}</p>}

          {!loading && !err && (
            <section className="home-grid">
              {filtered.map((r) => (
                <article
                  key={r.id}
                  className="recipe-card mm-card-click"
                  onClick={() => (window.location.hash = `/recipe/${r.id}`)}
                >
                  <div className="recipe-thumb">
                    {r.imageUrl && <img className="recipe-img" src={r.imageUrl} alt="" />}
                    {r.mins ? (
                      <span className="recipe-badge">
                        <Timer size={14} style={{ marginRight: 6 }} />
                        {r.mins} mins
                      </span>
                    ) : null}
                  </div>
                  <div className="recipe-meta">
                    <h3 className="recipe-title">{r.title}</h3>
                    <p className="recipe-tag">{r.tag}</p>
                  </div>
                  <button
                    className="recipe-save-btn"
                    aria-label="Save for later"
                    onClick={(e) => {
                      e.stopPropagation();
                      saveItem(r);
                    }}
                    title="Save for later"
                  >
                    <Bookmark size={16} />
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
