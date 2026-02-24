const taskService = require('../services/taskService')
const catchAsync = require('../utils/catchAsync')

const createTask = catchAsync(async (req, res) =>{
    const newTask = await taskService.createNewTask(req.user.id, req.body)
    res.status(201).json({status: 'success',data: { task: newTask }});
})

const getAllTask = catchAsync(async(req,res) =>{
    const tasks = await taskService.getAllTask(req.user.id)
    res.status(200).json({status: 'success',  data: { tasks }});
})

const updateTask = catchAsync(async(req, res) =>{
    const updatedTask = await taskService.updateMyTask(req.user.id, req.params.id, req.body)
    res.status(200).json({status: 'success',data: { task: updatedTask }});
})

const deleteTask = catchAsync(async(req,res) =>{
    const deletedTask = await taskService.deleteMyTask(req.user.id, req.params.id)
    res.status(204).send()
})

module.exports = { createTask, getAllTask, updateTask, deleteTask }