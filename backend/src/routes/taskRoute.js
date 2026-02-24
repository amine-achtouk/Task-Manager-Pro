const express = require('express')
const router = express.Router()
const { createTask, getAllTask, updateTask, deleteTask } = require('../controllers/taskController')
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.post('/', createTask)
router.post('/', getAllTask)
router.post('/:id', updateTask)
router.post('/:id', deleteTask)

module.exports = router
