import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./style.css";

import {
  Home, Bookmark, CalendarDays, ListTodo, UserCog, LogOut, Utensils, Loader2, Settings
} from "lucide-react";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

export default function MyMealPlan() {
  const [rawPlan, setRawPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState({});

  const PROFILE_BASE = import.meta.env.VITE_API_URL;
  const TOKEN = localStorage.getItem('token')

  const RECIPE_BASE = useMemo(() => {
    try {
      return PROFILE_BASE.replace(/\/profile\/?$/i, "/recipe/");
    } catch {
      return "http://localhost:3001/api/recipe/";
    }
  }, [PROFILE_BASE]);

  const fetchMealPlan = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${PROFILE_BASE}/profile/mealplan`, { 
        headers: { 'Authorization': `Bearer ${TOKEN}` } 
      });
      const arr = Array.isArray(res.data) ? res.data : [];
      setRawPlan(arr);

    // Fetch all recipe images
    //   const ids = [...new Set(arr.map((x) => x.recipeID).filter(Boolean))];
    //   if (ids.length) {
    //     const results = await Promise.allSettled(ids.map((id) => axios.get(`${RECIPE_BASE}recipe/${id}`)));
    //     const map = {};
    //     results.forEach((r, i) => {
    //       if (r.status === "fulfilled" && r.value?.data) {
    //         const d = r.value.data;
    //         map[d.recipe_id?.toString() || ids[i]] = d.image_url || null;
    //       }
    //     });
    //     setImages(map);
    //   } else {
    //     setImages({});
    //   }
    } catch (err) {
      console.error("GET /mealplan failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealPlan();
  }, []);

  const planGrid = useMemo(() => {
    const grid = {};
    DAYS.forEach((d) => {
      grid[d] = {};
      MEAL_TYPES.forEach((m) => (grid[d][m] = null));
    });
    rawPlan.forEach((item) => {
      const day = item.day?.toLowerCase();
      const mealType = item.mealType?.toLowerCase();
      if (grid[day] && grid[day][mealType] !== undefined) {
        grid[day][mealType] = { recipeID: item.recipeID, title: item.title };
      }
    });
    return grid;
  }, [rawPlan]);

  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

  const openRecipe = (recipeID) => {
    if (!recipeID) return;
    window.location.hash = `/recipe/${recipeID}`;
  };

  return (
    <div className="mm-app">
      {/* Sidebar */}
      <aside className="mm-sidebar">
        <div className="mm-sidebar-header">
          <h1 className="mm-title">
            <ListTodo size={20} /> My Meal Plan
          </h1>
          <p className="mm-subtitle">Full week overview</p>
        </div>

        <div className="mm-sidebar-actions">
          <button className="mm-sidebar-btn" onClick={() => (window.location.hash = "/home")}>
            <Home size={18} /> Home
          </button>
          <button className="mm-sidebar-btn" onClick={() => (window.location.hash = "/saved")}>
            <Bookmark size={18} /> Saved for later
          </button>
          <button className="mm-sidebar-btn" onClick={() => (window.location.hash = "/meal-planner")}>
            <CalendarDays size={18} /> Meal Planner
          </button>
          <button className="mm-sidebar-btn mm-sidebar-btn-active">
            <ListTodo size={18} /> My Meal Plan
          </button>
          <button className="mm-sidebar-btn" onClick={() => (window.location.hash = "/profile-setup")}>
            <UserCog size={18} /> Profile Setup
          </button>
          <button className="mm-sidebar-btn" onClick={() => (window.location.hash = "/settings")}>
            <Settings size={18} /> Settings
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="mm-content">
        <div className="mm-container">
          <div className="mmp-header-row">
            <h2>
              <Utensils size={20} /> Weekly Plan
            </h2>
            <span className="mmp-hint">Click a meal to view recipe details.</span>
          </div>

          {loading ? (
            <div className="loading-state">
              <Loader2 className="spin" size={22} />
              <span>Loading meal plan…</span>
            </div>
          ) : (
            <div className="mmp-grid-wrapper glass">
              <table className="mmp-table">
                <thead>
                  <tr>
                    <th className="mmp-day-stub">Meal Type</th>
                    {DAYS.map((d) => (
                      <th key={d} className="mmp-day-col">
                        {cap(d)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MEAL_TYPES.map((meal) => (
                    <tr key={meal}>
                      <td className="mmp-meal-col">{cap(meal)}</td>
                      {DAYS.map((day) => {
                        const cell = planGrid[day][meal];
                        // const img = cell?.recipeID ? images[cell.recipeID]?.toString() : null;
                        return (
                          <td key={day + meal} className="mmp-cell">
                            {cell ? (
                              <div
                                className="mmp-card"
                                onClick={() => openRecipe(cell.recipeID)}
                                role="button"
                                title={cell.title}
                              >
                                {/* <div
                                  className={`mmp-thumb ${img ? "has" : ""}`}
                                  style={img ? { backgroundImage: `url(${img})` } : undefined}
                                /> */}
                                <div className="mmp-title">{cell.title}</div>
                              </div>
                            ) : (
                              <span className="mmp-empty">–</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
