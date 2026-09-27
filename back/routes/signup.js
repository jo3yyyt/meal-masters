const bcrypt = require('bcrypt')
const signupRouter = require('express').Router()
const User = require('../models/user')

signupRouter.post('/', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(401).json({error: "Invalid username or password"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
        username: username,
        password: hashedPassword
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

module.exports = signupRouter