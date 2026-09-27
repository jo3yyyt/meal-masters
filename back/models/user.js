const mongoose = require('mongoose')
const mealPlannerSchema = require('./mealplan')
const savedSchema = require('./saved')

const userSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    allergies: {
        type: [String],
        default: [""]
    },
    intolerances: {
        type: [String],
        enum: ["", "dairy", "egg", "gluten", "grain", "peanut", "seafood", "sesame", "shellfish", "soy", "sulfite", "tree-nut", "wheat"],
        default: [""]
    },
    diet: {
        type: String,
        enum: ["", "gluten-free", "ketogenic", "vegetarian", "vegan", "pescetarian", "paleo"],
        default: ""
    },
    saved: [savedSchema],
    mealPlan: [mealPlannerSchema]
})

module.exports = mongoose.model('User', userSchema)