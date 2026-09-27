const profilesRouter = require('express').Router()
const { authenticateUser } = require('../utils/authentication')

profilesRouter.get('/preferences', authenticateUser, async (req, res) => {
  const user = req.user

  res.json({
    allergies: user.allergies,
    intolerances: user.intolerances,
    diet: user.diet
  })
})

profilesRouter.put('/preferences', authenticateUser, async (req, res) => {
  const { allergies, intolerances, diet } = req.body
  const user = req.user

  // Supported options
  const intoleranceOptions = ["", "dairy", "egg", "gluten", "grain", "peanut", "seafood", "sesame", "shellfish", "soy", "sulfite", "tree-nut", "wheat"]
  const dietOptions = ["", "gluten-free", "ketogenic", "vegetarian", "vegan", "pescetarian", "paleo"]

  // Check if intolerance and diet are valid
  if (intolerances && intolerances.some(intolerance => !intoleranceOptions.includes(intolerance))) {
    return res.status(400).json({ error: "Intolerance not supported" })
  }
  if (diet && !dietOptions.includes(diet)) {
    return res.status(400).json({ error: "Diet not supported" })
  }

  if (allergies !== undefined) {
    let allergiesArr
    if (typeof allergies === "string") {
      allergiesArr = allergies.split(',').map(allergy => allergy.trim())
    }
    else {
      allergiesArr = allergies
    }
    user.allergies = allergiesArr
  }
  if (intolerances !== undefined) {
    user.intolerances = intolerances
  }
  if (diet !== undefined) {
    user.diet = diet
  }

  await user.save()

  res.status(200).json({ message: "Preferences updated successfully" })
})

// Get saved recipes
profilesRouter.get('/saved', authenticateUser, async (req, res) => {
  const user = req.user

  res.json(user.saved)
})

// Saving recipes
profilesRouter.post('/saved', authenticateUser, async (req, res) => {
  const { recipeID, title } = req.body
  const user = req.user

  if (!recipeID || !title) {
    return res.status(400).json({ error: "recipeID and title required" })
  }

  const checkSaved = user.saved.some(recipe => recipe.recipeID === recipeID)
  if (checkSaved) {
    return res.status(400).json({ error: "Recipe has already been saved" })
  }

  user.saved.push({ recipeID, title })
  await user.save()

  res.status(200).json({ message: "Recipe saved successfully" })
})

// Delete saved recipe
profilesRouter.delete('/saved', authenticateUser, async (req, res) => {
  const { recipeID } = req.body
  const user = req.user

  user.saved = user.saved.filter(recipe => recipe.recipeID !== recipeID)
  await user.save()

  res.status(200).json({ message: "Recipe unsaved" })
})

// Get user's meal planner
profilesRouter.get('/mealplan', authenticateUser, async (req, res) => {
  const user = req.user

  res.json(user.mealPlan)
})

// Add meal to meal planner
profilesRouter.post('/mealplan', authenticateUser, async (req, res) => {
  const { day, mealType, recipeID, title } = req.body
  const user = req.user

  user.mealPlan.push({ day, mealType, recipeID, title })
  await user.save()

  res.json({ message: "Meal added to Meal Plan" })
})

// Remove a meal from meal planner
profilesRouter.delete('/mealplan', authenticateUser, async (req, res) => {
  const { day, mealType, recipeID } = req.body
  const user = req.user

  user.mealPlan = user.mealPlan.filter(meal => !(meal.day === day && meal.mealType === mealType && meal.recipeID === recipeID))
  await user.save()

  res.status(200).json({ message: "Meal successfully deleted from meal plan" })
})

module.exports = profilesRouter