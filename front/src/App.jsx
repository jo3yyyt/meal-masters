import React, { useSyncExternalStore } from "react";
import LandingHome from "./screens/LandingHome.jsx";
import Home from "./screens/Home.jsx";
import Saved from "./screens/Saved.jsx";
import ProfileSetup from "./screens/ProfileSetup.jsx";
import MealPlanner from "./screens/MealPlanner.jsx";
import MyMealPlan from "./screens/MyMealPlan.jsx";
import Login from "./screens/LoginScreen.jsx";
import SignUp from "./screens/Signup.jsx";
import Recipe from "./screens/Recipe.jsx";
import Settings from "./screens/Settings.jsx";

const useHash = () =>
  useSyncExternalStore(
    (cb) => {
      window.addEventListener("hashchange", cb);
      return () => window.removeEventListener("hashchange", cb);
    },
    () => window.location.hash || "#/welcome"
  );

// --- Main App ---
export default function App() {
  const raw = (useHash() || "").replace(/^#/, "");
  const recipeMatch = raw.match(/^\/recipe\/([^/?#]+)/);

  switch (true) {
    case raw === "/home":
      return <Home />;

    case raw === "/saved":
      return <Saved />;

    case raw === "/profile-setup":
      return <ProfileSetup />;

    case raw === "/meal-planner":
      return <MealPlanner />;

    case raw === "/my-meal-plan":
      return <MyMealPlan />;

    case raw === "/login":
      return <Login />;

    case raw === "/signup":
      return <SignUp />;

    case raw === "/settings":
      return <Settings />;

    case !!recipeMatch:
      return <Recipe id={decodeURIComponent(recipeMatch[1])} />;

    default:
      return <LandingHome />;
  }
}
