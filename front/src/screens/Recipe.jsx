import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import {
  ChevronLeft, Clock, Users2, Tag, Bookmark, Plus, CheckCircle2, Circle,
} from "lucide-react";

export default function Recipe({ id }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const token = localStorage.getItem('token')
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await axios.get(
          `${API_URL}/recipe/${encodeURIComponent(id)}`,
          { headers: { Authorisation: `Bearer ${token}` } }
        );
        if (!alive) return;
        setData(normalizeDetail(data));
      } catch (e) {
        console.error(e);
        if (alive) setErr("Could not load that recipe’s details.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const onSave = async () => {
    if (!data) return;
    try {
      setChecking(true);

      await axios.post(
        "${API_URL}/profile/saved",
        { recipeID: data.id, title: data.title },
        { headers: { Authorisation: token } }
      );

      const current = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
      if (!current.some((r) => r.id === data.id)) {
        const next = [
          ...current,
          { id: data.id, title: data.title, desc: data.desc, imageUrl: data.imageUrl },
        ];
        localStorage.setItem("savedRecipes", JSON.stringify(next));
      }
      alert("Saved for later ✅");
    } catch (e) {
      console.error(e);
      alert("Failed to save the recipe.");
    } finally {
      setChecking(false);
    }
  };

  if (loading) return <div className="mm-container"><p>Loading…</p></div>;
  if (err) return <div className="mm-container"><p style={{ color: "crimson" }}>{err}</p></div>;
  if (!data) return null;

  return (
    <main className="mm-content">
      <div className="mm-container">

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <button className="mm-secondary" onClick={() => window.history.back()}>
            <ChevronLeft size={18} style={{ verticalAlign: -3, marginRight: 6 }} />
            Back
          </button>
        </div>

        {/* Hero */}
        {data.imageUrl && (
          <div className="mm-hero rd-hero">
            <img className="rd-hero-img" src={data.imageUrl} alt={data.title} />
          </div>
        )}

        {/* Title */}
        <h1 className="mm-detail-title" style={{ marginBottom: 6 }}>{data.title}</h1>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {data.readyInMinutes ? (
            <Badge icon={<Clock size={14} />} label={`${data.readyInMinutes} min`} />
          ) : null}
          {data.servings ? (
            <Badge icon={<Users2 size={14} />} label={`${data.servings} servings`} />
          ) : null}
          {data.tags?.slice(0, 4).map((t, i) => (
            <Badge key={i} icon={<Tag size={14} />} label={t} />
          ))}
        </div>

        {/* Sticky actions */}
        <div className="mm-sticky-actions" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="mm-primary" onClick={onSave} disabled={checking}>
              <Bookmark size={16} style={{ marginRight: 8 }} />
              {checking ? "Saving…" : "Save for later"}
            </button>
            <button
              className="mm-secondary"
              onClick={() => (window.location.hash = "/meal-planner")}
            >
              <Plus size={16} style={{ marginRight: 8 }} />
              Add to Meal Planner
            </button>
          </div>
        </div>

        {/* Overview */}
        {data.desc && (
          <section className="mm-detail-card">
            <h3 style={{ marginTop: 0 }}>Overview</h3>
            <p style={{ marginBottom: 0 }}>{data.desc}</p>
          </section>
        )}

        {}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 16,
            marginTop: 16,
          }}
        >
          {/* Ingredients */}
          <section className="mm-detail-card">
            <h3 style={{ marginTop: 0 }}>Ingredients</h3>
            {data.ingredients?.length ? (
              <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
                {data.ingredients.map((it, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "6px 0",
                      borderBottom:
                        i === data.ingredients.length - 1 ? "none" : "1px dashed var(--line)",
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>
                      <strong>
                        {formatQty(it.amount, it.unit)}
                      </strong>{" "}
                      {it.name}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No ingredients listed.</p>
            )}
          </section>

          {/* Instructions */}
          <section className="mm-detail-card">
            <h3 style={{ marginTop: 0 }}>Instructions</h3>
            {data.instructions?.length ? (
              <ol style={{ margin: 0, paddingLeft: 18 }}>
                {data.instructions.map((step, i) => (
                  <li key={i} style={{ margin: "8px 0", lineHeight: 1.5 }}>
                    {step}
                  </li>
                ))}
              </ol>
            ) : (
              <p>No instructions available.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

/* ---------- helpers ---------- */

function Badge({ icon, label }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 800,
        background: "#fff",
        border: "1px solid var(--line)",
        boxShadow: "var(--shadow-1)",
      }}
    >
      {icon}
      {label}
    </span>
  );
}

function normalizeDetail(raw) {
  const clean = (s) => (s || "").replace(/<[^>]+>/g, "").trim();
  return {
    id: raw.recipe_id,
    title: raw.recipe_name || "Untitled",
    imageUrl: raw.image_url || null,
    readyInMinutes: raw.prep_time_minutes || null,
    servings: raw.servings || null,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    desc: clean(raw.description),
    ingredients: Array.isArray(raw.ingredients)
      ? raw.ingredients.map((it) => ({
          name: it.name,
          amount: it.amount,
          unit: it.unit,
        }))
      : [],
    instructions: Array.isArray(raw.instructions) ? raw.instructions : [],
  };
}

function formatQty(amount, unit) {
  if (amount == null && !unit) return "";
  if (amount == null) return unit || "";
  if (!unit) return String(amount);
  return `${Number(amount)} ${unit}`.trim();
}
