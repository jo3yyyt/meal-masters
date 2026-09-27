import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";
import "./style.css";
import {
  UtensilsCrossed, Home, Bookmark, CalendarDays, ListTodo, UserCog, LogOut, Settings
} from "lucide-react";

/* ---------- options ---------- */
const INTOLERANCE_OPTIONS = [
  { value: "dairy", label: "Dairy" },
  { value: "egg", label: "Egg" },
  { value: "gluten", label: "Gluten" },
  { value: "grain", label: "Grain" },
  { value: "peanut", label: "Peanut" },
  { value: "seafood", label: "Seafood" },
  { value: "sesame", label: "Sesame" },
  { value: "shellfish", label: "Shellfish" },
  { value: "soy", label: "Soy" },
  { value: "sulfite", label: "Sulfite" },
  { value: "tree-nut", label: "Tree Nut" },
  { value: "wheat", label: "Wheat" },
];

const DIET_OPTIONS = [
  { value: "", label: "None" },
  { value: "gluten-free", label: "Gluten-free" },
  { value: "ketogenic", label: "Ketogenic" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "pescetarian", label: "Pescetarian" },
  { value: "paleo", label: "Paleo" },
];

const baseURL = (() => {
  const u = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "/api";
  return u.endsWith("/") ? u.slice(0, -1) : u;
})();

const INITIAL_PROFILE = { allergies: "", dietType: "", intolerances: [] };

/* ---------- helpers ---------- */
const SidebarButton = ({ icon: Icon, children, ...props }) => (
  <button {...props} className="mm-sidebar-btn">
    {Icon ? <Icon size={18} /> : null}
    <span>{children}</span>
  </button>
);

const toTitle = (s = "") =>
  s
    .split(/[\s-]+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");

const getQueryParams = () => {
  const hash = window.location.hash || "";
  const qIndex = hash.indexOf("?");
  const search = qIndex >= 0 ? hash.slice(qIndex) : window.location.search;
  return new URLSearchParams(search);
};

/* ============= Component ============= */
export default function ProfileSetup() {
  // Decide first if this visit should be a clean slate (signup-only)
  const shouldStartFresh = useMemo(() => {
    try {
      const qp = getQueryParams();
      const byParam = qp.get("fresh") === "1";
      const byFlag = localStorage.getItem("justSignedUp") === "1";
      return byParam || byFlag;
    } catch {
      return false;
    }
  }, []);

  // Initial load: if fresh, start empty; else hydrate from localStorage
  const [profile, setProfile] = useState(() => {
    if (shouldStartFresh) return INITIAL_PROFILE;
    const saved = localStorage.getItem("profile");
    if (!saved) return INITIAL_PROFILE;
    try {
      const parsed = JSON.parse(saved);
      return {
        allergies: parsed.allergies ?? "",
        dietType: parsed.dietType ?? parsed.diet ?? "",
        intolerances: Array.isArray(parsed.intolerances) ? parsed.intolerances : [],
      };
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const fetchedOnce = useRef(false); // avoid double-fetch/overwrite

  // If fresh, clear stale storage before first paint
  useLayoutEffect(() => {
    if (shouldStartFresh) {
      localStorage.removeItem("profile");
      localStorage.removeItem("justSignedUp");
      const hash = window.location.hash;
      if (hash.includes("?fresh=1")) {
        window.history.replaceState(null, "", hash.replace("?fresh=1", ""));
      }
    }
  }, [shouldStartFresh]);

  // Persist on any local change
  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);

  // Returning users: fetch latest from API once and merge in (no flicker)
  useEffect(() => {
    if (shouldStartFresh || fetchedOnce.current) return;

    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) return;

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(`${baseURL}/profile/preferences`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });
        if (!res.ok) return;

        const data = await res.json();
        const server = {
          allergies: data.allergies ?? "",
          dietType: data.dietType ?? data.diet ?? "",
          intolerances: Array.isArray(data.intolerances) ? data.intolerances : [],
        };

        // Only update if different from what we have (prevents clobbering live edits)
        const current = JSON.stringify(profile);
        const incoming = JSON.stringify(server);
        if (current !== incoming) {
          setProfile(server);
          localStorage.setItem("profile", JSON.stringify(server));
        }
      } catch (e) {
        // ignore fetch errors
      } finally {
        fetchedOnce.current = true;
      }
    })();

    return () => controller.abort();
  }, [shouldStartFresh, profile]);

  const handleText = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: 12,
      borderColor: state.isFocused ? "var(--brand)" : "var(--line-soft)",
      boxShadow: state.isFocused
        ? "0 0 0 3px color-mix(in srgb, var(--brand) 25%, transparent)"
        : "none",
      "&:hover": { borderColor: "var(--brand)" },
      padding: "4px 6px",
      minHeight: "48px",
      fontSize: "15px",
      backgroundColor: "#fff",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "var(--brand)"
        : state.isFocused
        ? "#f3eeea"
        : "#fff",
      color: state.isSelected ? "#fff" : "#111",
      fontWeight: state.isSelected ? 700 : 500,
    }),
    multiValue: (base) => ({ ...base, backgroundColor: "var(--brand)", borderRadius: 10 }),
    multiValueLabel: (base) => ({ ...base, color: "#fff", fontWeight: 700 }),
    singleValue: (base) => ({ ...base, color: "#111", fontWeight: 700 }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      setToast("Not signed in — missing token");
      setTimeout(() => setToast(""), 1800);
      return;
    }

    const payload = {
      allergies: profile.allergies || "",
      intolerances: profile.intolerances,
      diet: profile.dietType,
    };

    try {
      setSaving(true);
      const res = await fetch(`${baseURL}/profile/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to save profile");
      }

      setToast("Preferences saved ✅");
    } catch (err) {
      console.error(err);
      setToast("Save failed ❌");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(""), 1600);
    }
  };

  const dietLabel = profile.dietType ? toTitle(profile.dietType.replaceAll("-", " ")) : "None";
  const intoleranceLabel = profile.intolerances?.length
    ? profile.intolerances.map((v) => toTitle(v.replaceAll("-", " "))).join(", ")
    : "None";
  const allergiesLabel = profile.allergies?.toString().trim() ? profile.allergies : "None";

  return (
    <div className="mm-app">
      {/* Sidebar */}
      <aside className="mm-sidebar">
        <div className="mm-sidebar-header">
          <div className="mm-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <UtensilsCrossed size={20} />
            Meal Masters
          </div>
          <div className="mm-subtitle">Set your dietary filters</div>
        </div>

        <div className="mm-sidebar-actions">
          <SidebarButton icon={Home} onClick={() => (window.location.hash = "/home")}>Home</SidebarButton>
          <SidebarButton icon={Bookmark} onClick={() => (window.location.hash = "/saved")}>Saved for later</SidebarButton>
          <SidebarButton icon={CalendarDays} onClick={() => (window.location.hash = "/meal-planner")}>Meal Planner</SidebarButton>
          <SidebarButton icon={ListTodo} onClick={() => (window.location.hash = "/my-meal-plan")}>My Meal Plan</SidebarButton>
          <SidebarButton icon={UserCog} className="mm-sidebar-btn-active" onClick={() => (window.location.hash = "/profile-setup")}>Profile Setup</SidebarButton>
          <SidebarButton icon={Settings} onClick={() => (window.location.hash = "/settings")}>Settings</SidebarButton>
        </div>
      </aside>

      {/* Profile Content */}
      <main className="mm-content">
        <div className="mm-container">
          <h2 style={{ marginTop: 0, fontWeight: 800 }}>My Profile</h2>
          <p style={{ marginTop: -6, color: "#555", marginBottom: 12 }}>
            Your dietary filters help us tailor recipes.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: 20, alignItems: "start" }}>
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              style={{
                background: "var(--panel-muted)",
                borderRadius: 16,
                padding: "2rem",
                display: "grid",
                gap: 20,
                fontSize: "15px",
              }}
            >
              <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
                Allergies
                <input
                  type="text"
                  name="allergies"
                  value={profile.allergies}
                  onChange={handleText}
                  placeholder="e.g. peanuts, dairy"
                  style={{
                    padding: "0.9rem 1rem",
                    borderRadius: 12,
                    border: "1px solid var(--line-soft)",
                    background: "#fff",
                    fontFamily: "inherit",
                    fontSize: "15px",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1px solid var(--brand)";
                    e.target.style.boxShadow =
                      "0 0 0 3px color-mix(in srgb, var(--brand) 25%, transparent)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = "1px solid var(--line-soft)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <small style={{ color: "#666", fontWeight: 500 }}>
                  Tip: separate multiple allergies with commas.
                </small>
              </label>

              <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
                Diet
                <Select
                  name="dietType"
                  options={DIET_OPTIONS}
                  value={DIET_OPTIONS.find((opt) => opt.value === profile.dietType) || null}
                  onChange={(selected) =>
                    setProfile((p) => ({ ...p, dietType: selected ? selected.value : "" }))
                  }
                  classNamePrefix="react-select"
                  placeholder="Select diet..."
                  isClearable
                  styles={selectStyles}
                />
              </label>

              <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
                Intolerances
                <Select
                  isMulti
                  name="intolerances"
                  options={INTOLERANCE_OPTIONS}
                  value={INTOLERANCE_OPTIONS.filter((opt) =>
                    profile.intolerances.includes(opt.value)
                  )}
                  onChange={(selected) =>
                    setProfile((p) => ({
                      ...p,
                      intolerances: (selected ?? []).map((s) => s.value),
                    }))
                  }
                  classNamePrefix="react-select"
                  placeholder="Select intolerances..."
                  styles={selectStyles}
                />
              </label>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="submit" className="mm-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="mm-secondary"
                  onClick={() => setProfile(INITIAL_PROFILE)}
                  disabled={saving}
                >
                  Reset
                </button>
              </div>
            </form>

            {/* Live summary/preview */}
            <aside className="mm-detail-card" style={{ position: "sticky", top: 20 }}>
              <h3 style={{ marginTop: 0, fontWeight: 800, color: "var(--text-strong)" }}>
                Your preferences
              </h3>
              <div className="pm-row" style={{ padding: "8px 0" }}>
                <span style={{ color: "var(--muted)" }}>Diet</span>
                <b>{dietLabel}</b>
              </div>
              <div className="pm-row" style={{ padding: "8px 0" }}>
                <span style={{ color: "var(--muted)" }}>Allergies</span>
                <b style={{ maxWidth: 220, textAlign: "right" }}>{allergiesLabel}</b>
              </div>
              <div className="pm-row" style={{ padding: "8px 0" }}>
                <span style={{ color: "var(--muted)" }}>Intolerances</span>
                <b style={{ maxWidth: 220, textAlign: "right" }}>{intoleranceLabel}</b>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {toast && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 20,
            background: "#111",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 12,
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
