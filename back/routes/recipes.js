const axios = require('axios')
const config = require('../utils/config')
const recipesRouter = require('express').Router()
const { authenticateUser } = require('../utils/authentication')

// Get recipe list by meal type (breakfast/main-course/dessert/snack)
recipesRouter.get('/recipeList/:mealType', authenticateUser, (req, res) => {
  const mealType = req.params.mealType
  const user = req.user

  const intoleranceStr = user.intolerances.join(',')
  const allergyStr = user.allergies.join(',')
  
  axios.get('https://api.spoonacular.com/recipes/complexSearch?apiKey=' + config.API_KEY + '&diet=' + user.diet + '&intolerances=' + intoleranceStr + '&excludeIngredients=' + allergyStr + '&type=' + mealType + '&number=10&sort=random')
    .then(response => {
      res.json(response.data)
    })
})

//Get individual recipe information
recipesRouter.get('/:id', (req, res) => {
  const id = req.params.id

  axios.get('https://api.spoonacular.com/recipes/' + id + '/information?apiKey=' + config.API_KEY + '&includeNutrition=false&addWinePairing=false&addTasteData=false')
    .then(response => {
      const recipe = response.data
      const tagsArray = recipe.cuisines.concat(recipe.diets)
      const instructionsArray = recipe.analyzedInstructions[0].steps.map(instruction => instruction.step)
      const ingredientsArray = recipe.extendedIngredients.map(item => ({
        name: item.name,
        amount: item.amount,
        unit: item.unit
      }))

      res.json({
        "recipe_id": id,
        "recipe_name": recipe.title,
        "image_url": recipe.image,
        "description": recipe.summary,
        "prep_time_minutes": recipe.readyInMinutes,
        "meal_type": recipe.dishTypes,
        "tags": tagsArray,
        "ingredients": ingredientsArray,
        "instructions": instructionsArray
      })
    })
})

// Get recipe list from search query - tailored results
recipesRouter.get('/searchProfile/:query', authenticateUser, (req, res) => {
  const query = req.params.query
  const user = req.user

  const intoleranceStr = user.intolerances.join(',')
  const allergyStr = user.allergies.join(',')
  
  axios.get('https://api.spoonacular.com/recipes/complexSearch?apiKey=' + config.API_KEY + '&query' + query + '&diet=' + user.diet + '&intolerances=' + intoleranceStr + '&excludeIngredients=' + allergyStr + '&sort=random')
    .then(response => {
      res.json(response.data)
    })
})

// Get recipe list from search query - all results
recipesRouter.get('/search/:query', authenticateUser, (req, res) => {
  const query = req.params.query
  
  axios.get('https://api.spoonacular.com/recipes/complexSearch?apiKey=' + config.API_KEY + '&query' + query + '&sort=random')
    .then(response => {
      res.json(response.data)
    })
})

module.exports = recipesRouter