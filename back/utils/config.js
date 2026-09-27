require('dotenv').config()

const API_KEY = process.env.API_KEY
const MONGO_URL = process.env.MONGO_URL
const JWT_SECRET = process.env.JWT_SECRET

module.exports = { API_KEY, MONGO_URL, JWT_SECRET }