const express = require('express')
const router = express.Router()
const validation = require('../middlewares/validate')
const { registerSchema, loginSchema } = require('../validations/authvalidation')
const { registerUser, loginUser, refreshToken } = require('../controllers/authController')

router.post('/register', validation(registerSchema), registerUser)
router.post('/login',validation(loginSchema), loginUser)
router.post('/refresh', refreshToken)


module.exports = router