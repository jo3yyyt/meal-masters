const jwt = require('jsonwebtoken')
const config = require('./config')
const User = require('../models/user')

// Get token from header
const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

const authenticateUser = async (req, res, next) => {
    try {
        // Check if token is valid
        const token = getTokenFrom(req)
        if (!token) {
            return res.status(401).json({ error: "Token missing" })
        }

        // Verify token
        const decodedToken = jwt.verify(token, config.JWT_SECRET)
        if (!decodedToken.id) {
            return res.status(401).json({ error: "Token invalid" })
        }

        // Get user from token
        const user = await User.findById(decodedToken.id)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({ error: "Invalid token "})
    }
}

module.exports = { authenticateUser }