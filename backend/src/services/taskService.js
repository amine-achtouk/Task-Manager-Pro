const AppError = require('../utils/AppError')
const taskRepository = require('../repositories/taskRepository')

const createNewTask = async (userId, taskData) =>{
    const { title, description} = taskData
    if(!title || !title.trim()) throw new AppError('Title is required', 400)

    const newTaskData = {
        title: title.trim(),
        description,
        author: userId
    }
    return await taskRepository.createTask(newTaskData)
}

const getAllTask = async (userId) =>{
    return await taskRepository.findTasksByUserId(userId)
}

const updateMyTask = async (userId, taskId, updateData) =>{
    const existingTask  = await taskRepository.findTaskById(taskId)
    if(!existingTask ) throw new AppError('Task not found', 404)

    if(existingTask.author.toString() !== userId) throw new AppError('Not authorized to update this task', 403)
    if (existingTask.status === 'completed') throw new AppError('Cannot update a completed task', 400)


    const allowedFields = ['title', 'description', 'status']
    const filteredData = Object.keys(updateData)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => ({ ...obj, [key]: updateData[key] }), {})

    if (Object.keys(filteredData).length === 0) {
    throw new AppError('No valid fields to update', 400)
    }
    return await taskRepository.updateTask(taskId, filteredData)

}

const deleteMyTask = async (userId, taskId) =>{
    const existingTask  = await taskRepository.findTaskById(taskId)
    if(!existingTask ) throw new AppError('Task not found', 404)

    if(existingTask.author.toString() !== userId) throw new AppError('Not authorized to delete this task', 403)

    return await taskRepository.deleteTask(taskId)
}

module.exports = { createNewTask, getAllTask, updateMyTask, deleteMyTask }