const mongoose = require('mongoose')

const savedSchema = new mongoose.Schema({
    recipeID: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
})

module.exports = savedSchema