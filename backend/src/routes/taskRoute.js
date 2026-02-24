const express = require('express')
const router = express.Router()
const { createTask, getAllTask, updateTask, deleteTask } = require('../controllers/taskController')
const authMiddleware = require('../middlewares/authMiddleware')
const validation = require('../middlewares/validate')
const { createTaskSchema } = require('../validations/taskvalidation')

router.use(authMiddleware)

router.post('/', validation(createTaskSchema), createTask)
router.post('/', getAllTask)
router.post('/:id', updateTask)
router.post('/:id', deleteTask)

module.exports = router
