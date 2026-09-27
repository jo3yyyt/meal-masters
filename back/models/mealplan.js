const mongoose = require('mongoose')

const mealPlannerSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        required: true
    },
    mealType: {
        type: String,
        enum: ["breakfast", "lunch", "dinner", "snack"],
        required: true
    },
    recipeID: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
})

module.exports = mealPlannerSchema