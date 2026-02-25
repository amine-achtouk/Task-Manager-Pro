const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middlewares/errorHandler')
const { apiLimiter } = require('./config/rateLimit')



const app = express()


app.use(cors())
app.use(express.json())
app.use(cookieParser())


const authRoute = require('./routes/authRoute')
const taskRoute = require('./routes/taskRoute')

app.use('/api', apiLimiter)
app.use('/api/auth', authRoute)
app.use('/api/task', taskRoute)

app.use(errorHandler)

module.exports = app