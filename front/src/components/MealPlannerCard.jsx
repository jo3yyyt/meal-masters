import React from 'react'
import "../screens/style.css"

const MealPlannerCard = (props) => {
  return (
    <div className="meal-day">
      <div className="meal-day-head">
        <h3>{props.day.charAt(0).toUpperCase() + props.day.slice(1)}</h3>
      </div>
      
      {props.meals.length > 0 ? (
        <ul className="meal-list">
          {props.meals.map((meal) => (
            <li className="meal-item planner-meal-text">
              <strong>{meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}</strong>{meal.title}
              <button className="delete-button" onClick={() => props.onDeleteMeal(props.day, meal.mealType, meal.recipeID)}>✖</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-meals">No meals planned</p>
      )}
    </div>
  )
}

export default MealPlannerCard