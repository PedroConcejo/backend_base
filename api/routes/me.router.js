
const router = require('express').Router()

const profileRouter = require('./profile.router')

router.use('/profile', profileRouter)
module.exports = router
