const Task = require('../models/taskModel')

const createTask = (taskData) =>{
    return Task.create(taskData)
}

const findTasksByUserId = (userId) =>{
    return Task.find({ author : userId})
}

const findTaskById = (taskId) => {
    return Task.findById(taskId)
}

const updateTask = (taskId, updateData) =>{
    return Task.findByIdAndUpdate(taskId, updateData, {
        new: true,
        runValidators: true
    })
}

const deleteTask = (taskId) =>{
    return Task.findByIdAndDelete(taskId)
}


module.exports = { createTask, findTasksByUserId, findTaskById, updateTask, deleteTask }