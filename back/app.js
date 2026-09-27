const express = require('express')
const config = require('./utils/config')
const cors = require('cors')

const mongoose = require('mongoose')
const url = config.MONGO_URL
mongoose.connect(url, {dbName: 'COMP3120-Project'})

const recipesRouter = require('./routes/recipes')
const loginRouter = require('./routes/login')
const signupRouter = require('./routes/signup')
const profilesRouter = require('./routes/profile')

const app = express()

app.use(express.json())

app.use(cors({
    origin: ['https://meal-masters-u0qw.onrender.com', 'http://localhost:5173'],
    credentials: true
}))

app.use('/api/recipe', recipesRouter)
app.use('/api/login', loginRouter)
app.use('/api/signup', signupRouter)
app.use('/api/profile', profilesRouter)

module.exports = app