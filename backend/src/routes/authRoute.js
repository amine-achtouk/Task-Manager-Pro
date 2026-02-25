const express = require('express')
const router = express.Router()
const { registerSchema, loginSchema } = require('../validations/authvalidation')
const { registerUser, loginUser, refreshToken } = require('../controllers/authController')
const validation = require('../middlewares/validate')
const { authLimiter } = require('../config/rateLimit')


router.post('/register',authLimiter, validation(registerSchema), registerUser)
router.post('/login',authLimiter, validation(loginSchema), loginUser)
router.post('/refresh', refreshToken)


module.exports = router