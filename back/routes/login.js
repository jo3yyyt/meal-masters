const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
    const {username, password} = req.body

    const user = await User.findOne({ username: username })

    if (!user) {
        return res.status(401).json({error: "Account not found"})
    }

    if (!username || !password) {
        return res.status(401).json({error: "Invalid username or password"})
    }

    if (await bcrypt.compare(password, user.password)) {
        console.log("Password correct")

        const userForToken = {
            id: user._id
        }
        const token = jwt.sign(userForToken, config.JWT_SECRET)

        return res.status(200).json({token, username: user._id})
    }
    else {
        return res.status(401).json({error: "Invalid username or password"})
    }
})

module.exports = loginRouter