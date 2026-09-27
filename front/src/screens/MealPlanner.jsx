import React, { useEffect, useMemo, useState } from "react"
import axios from "axios"
import "./style.css"
import MealPlannerCard from "../components/MealPlannerCard"

import {
  Home,
  Bookmark,
  CalendarDays,
  ListTodo,
  UserCog,
  LogOut,
  Plus,
  Settings
} from "lucide-react"

const SidebarButton = ({ icon: Icon, children, ...props }) => (
  <button {...props} className="mm-sidebar-btn">
    {Icon ? <Icon size={18} /> : null}
    <span>{children}</span>
  </button>
)

const DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]
const MEAL_TYPES = ["breakfast","lunch","dinner","snack"]

const MealPlanner = () => {
  const [savedRecipes, setSavedRecipes] = useState([])   
  const [mealPlan, setMealPlan] = useState([])
  const [day, setDay] = useState("")
  const [mealType, setMealType] = useState("")
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  const token = localStorage.getItem('token')
  const URL = import.meta.env.VITE_API_URL 

  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  )

  const getSavedRecipes = async () => {
    axios.get(`${URL}/profile/saved`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        setSavedRecipes(res.data)
      })
      .catch(error => console.error('Error:', error))
  }

  const getMealPlan = async () => {
    try {
      const res = await axios.get(`${URL}/profile/mealplan`, { headers })
      setMealPlan(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error("GET mealplan failed", err)
    }
  }

  const updateMealPlan = async (recipeID, title) => {
    if (!day || !mealType || !recipeID) return
    try {
      await axios.post(`${URL}/profile/mealplan`,
        { day, mealType, recipeID, title },
        { headers }
      )
      await getMealPlan()
      setSelectedRecipe(null)
      setDay("")
      setMealType("")
    } catch (err) {
      console.error("POST mealplan failed", err)
    }
  }

  const deleteMeal = async (day, mealType, recipeID) => {
    try {
      await axios.delete(`${URL}/profile/mealplan`, {
        data: { day, mealType, recipeID },
        headers
      })
      await getMealPlan()
    } catch (err) {
      console.error("DELETE mealplan failed", err)
    }
  }

  useEffect(() => {
    getSavedRecipes()
    getMealPlan()
  }, [])

  return (
    <div className="mm-app">
      {/* Sidebar */}
      <aside className="mm-sidebar">
        <div className="mm-sidebar-header">
          <h1 className="mm-title">Meal Planner</h1>
          <p className="mm-subtitle">Plan your week</p>
        </div>

        <div className="mm-sidebar-actions">
          <SidebarButton icon={Home} onClick={() => (window.location.hash = "/home")}>
            Home
          </SidebarButton>
          <SidebarButton icon={Bookmark} onClick={() => (window.location.hash = "/saved")}>
            Saved for later
          </SidebarButton>
          <SidebarButton icon={CalendarDays} className="mm-sidebar-btn-active" onClick={() => (window.location.hash = "/meal-planner")}>
            Meal Planner
          </SidebarButton>
          <SidebarButton icon={ListTodo} onClick={() => (window.location.hash = "/my-meal-plan")}>
            My Meal Plan
          </SidebarButton>
          <SidebarButton icon={UserCog} onClick={() => (window.location.hash = "/profile-setup")}>
            Profile Setup
          </SidebarButton>
          <SidebarButton icon={Settings} onClick={() => (window.location.hash = "/settings")}>
            Settings
          </SidebarButton>
        </div>
      </aside>

      {/* Content */}
      <main className="mm-content">
        <div className="mm-container">
          <div className="mmp-header-row">
            <h2>Build your week</h2>
            <span className="mmp-hint">Choose a saved recipe and add it to a day & meal.</span>
          </div>

          <div className="planner-2col">
            {/* Left: Saved Recipes */}
            <section className="saved-panel glass">
              <div className="saved-panel-head">
                <h3><Bookmark size={18} /> Saved Recipes</h3>
              </div>

              {savedRecipes.length === 0 ? (
                <div className="saved-empty-card">
                  <Bookmark size={22} />
                  <h4>No saved recipes yet</h4>
                  <p className="muted">Save recipes from the feed to use them here.</p>
                </div>
              ) : (
                <ul className="saved-list">
                  {savedRecipes.map((r) => (
                    <li key={r.recipeID} className="saved-item">
                      <div className="saved-main">
                        <span className="saved-title">{r.title}</span>
                      </div>
                      <button
                        className="chip-add"
                        onClick={() => setSelectedRecipe(r)}
                        title="Add to plan"
                      >
                        <Plus size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Right: Week grid */}
            <section className="meal-planner glass">
              <h3><CalendarDays size={18} /> Meal Planner</h3>

              {mealPlan.length > 0 ? (
                <div className="meal-plan-days">
                  {DAYS.map((d) => {
                    const sortOrder = MEAL_TYPES
                    const dayMeals = mealPlan
                      .filter((m) => (m.day || "").toLowerCase() === d)
                      .sort((a, b) => sortOrder.indexOf(a.mealType) - sortOrder.indexOf(b.mealType))
                    return (
                      <MealPlannerCard
                        key={d}
                        day={d}
                        meals={dayMeals}
                        onDeleteMeal={deleteMeal}
                      />
                    )
                  })}
                </div>
              ) : (
                <p className="muted">No meals planned yet.</p>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Add modal */}
      {selectedRecipe && (
        <div className="overlay">
          <div className="modal">
            <h3>Add “{selectedRecipe.title}”</h3>
            <label className="modal-field">
              <span>Day</span>
              <select value={day} onChange={(e) => setDay(e.target.value)}>
                <option value="">Select</option>
                {DAYS.map(d => (
                  <option key={d} value={d}>{d[0].toUpperCase()+d.slice(1)}</option>
                ))}
              </select>
            </label>

            <label className="modal-field">
              <span>Meal Type</span>
              <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                <option value="">Select</option>
                {MEAL_TYPES.map(m => (
                  <option key={m} value={m}>{m[0].toUpperCase()+m.slice(1)}</option>
                ))}
              </select>
            </label>

            <div className="modal-buttons">
              <button
                id="add-button"
                className="mm-primary"
                onClick={() => updateMealPlan(selectedRecipe.recipeID, selectedRecipe.title)}
                disabled={!day || !mealType}
              >
                Add
              </button>
              <button id="cancel-button" className="mm-secondary" onClick={() => setSelectedRecipe(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MealPlanner
