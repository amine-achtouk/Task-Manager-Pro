const authService = require('../services/authService')
const catchAsync = require('../utils/catchAsync')

const registerUser = catchAsync(async (req, res) =>{
    const { createdUser, accessToken, refreshToken } = await authService.registerUser(req.body)
    res.cookie('refreshToken', refreshToken,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.status(201).json({ success: true, data: { user: createdUser ,accessToken}})
})

const loginUser = catchAsync(async (req, res) =>{
    const { accessToken, refreshToken } = await authService.loginUser(req.body)
    res.cookie('refreshToken', refreshToken,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.status(200).json({ success: true, data: {accessToken}})
})

const refreshToken = catchAsync(async (req, res) => {
    const token = req.cookies.refreshToken
    const { accessToken } = await authService.refreshAccessToken(token)
    res.status(200).json({ success: true, data: { accessToken } })
})

module.exports = { registerUser, loginUser, refreshToken }
