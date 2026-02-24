const userRepository = require('../repositories/userRepository')
const AppError = require('../utils/AppError')
const bcrypt = require('bcrypt')
const {generateAccessToken, generateRefreshToken, verifyRefreshToken} = require('../utils/jwt')

const registerUser = async (userData) =>{
    const { username, email, password } = userData
    if(!username.trim() || !email.trim() || !password.trim()) throw new AppError('All fiels Requered', 400)

    const existUser = await userRepository.findUserByEmail(email)
    if(existUser) throw new AppError('User Already Exist', 400)

    const hashPassword = await bcrypt.hash(password, 12)


    const createdUser = await userRepository.createUser({
        username,
        email,
        password: hashPassword
    })

    const accessToken = generateAccessToken(createdUser._id)
    const refreshToken = generateRefreshToken(createdUser._id)
    return { createdUser, accessToken, refreshToken }

}

const loginUser = async (userData) =>{
    const { email, password } = userData
    if(!email.trim() || !password.trim()) throw new AppError('All fiels Requered', 400)

    const findUser = await userRepository.findUserByEmailWithPassword(email)
    if(!findUser) throw new AppError('Invalid email or password', 401)

    const isMatchPassword = await bcrypt.compare(password, findUser.password)
    if(!isMatchPassword) throw new AppError('Invalid email or password', 401)

    const accessToken = generateAccessToken(findUser._id)
    const refreshToken = generateRefreshToken(findUser._id)
    return { accessToken, refreshToken }
}

const refreshAccessToken = async (refreshToken) => {
    if(!refreshToken) throw new AppError('No refresh token', 401)

    const decoded = verifyRefreshToken(refreshToken)
    if(!decoded) throw new AppError('Invalid or expired refresh token', 401)

    const user = await userRepository.findById(decoded.id)
    if(!user) throw new AppError('User not found', 401)

    const accessToken = generateAccessToken(user._id)
    return { accessToken }
}

module.exports = { registerUser, loginUser, refreshAccessToken }