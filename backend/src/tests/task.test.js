const request = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')

let accessToken

beforeAll(async () =>{
    await mongoose.connect(process.env.MONGO_URI_TEST)
    const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', email: 'workspace@test.com', password: '12345678' })

    accessToken = res.body.data.accessToken
})

afterAll(async () =>{
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
})

describe('Task - Create', () =>{
    it('should create task successfully', async () =>{
        const res = await request(app)
        .post('/api/task')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Test Task', description : 'test' })
    expect(res.status).toBe(201)
    expect(res.body.data.task.title).toBe('Test Task')
    })
    it('should fail without token', async () => {
        const res = await request(app)
            .post('/api/task')
            .send({ title: 'Test task' })
        expect(res.status).toBe(401)
    })
    it('should fail with empty Title', async() =>{
        const res = await request(app)
            .post('/api/task')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({})
        expect(res.status).toBe(400)
    })
})


describe('Task - Get', () =>{
    it('should get Task successfully', async () =>{
        const res = await request(app)
            .get('/api/task')
            .set('Authorization', `Bearer ${accessToken}`)
        expect(res.status).toBe(200)
    })
    it('should fail without token', async () =>{
        const res = await request(app)
            .get('/api/task')
        expect(res.status).toBe(401)
    })
})


describe('Task - Update',  () =>{
    let taskId
    let anotherUserToken

    beforeAll(async () =>{
        const task = await request(app)
            .post('/api/task')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 'update Task'})
        taskId = task.body.data.task._id

        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'another', email: 'another@test.com', password: '12345678' })
        anotherUserToken = res.body.data.accessToken
    })
    it('should update successfully', async () => {
        const res = await request(app)
            .patch(`/api/task/${taskId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 'update Task'})
        expect(res.status).toBe(200)
    })
    it('should fail without token', async () => {
        const res = await request(app)
            .patch(`/api/task/${taskId}`)
            .send({title: 'update Task' })
        expect(res.status).toBe(401)
    })
    it('should fail if not owner', async () => {
        const res = await request(app)
            .patch(`/api/task/${taskId}`)
            .set('Authorization', `Bearer ${anotherUserToken}`)
            .send({ Title: 'Hacked Task' })
        expect(res.status).toBe(403)
    })
})


describe('Workspace - Delete', () => {
    let taskId;
    let anotherUserToken;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'another2', email: 'another2@test.com', password: '12345678'
            });
        anotherUserToken = res.body.data.accessToken;

        const task = await request(app)
            .post('/api/task')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 'task To Delete' });
        taskId = task.body.data.task._id;
    });

    it('should fail without token', async () => {
        const res = await request(app)
            .delete(`/api/task/${taskId}`);
        expect(res.status).toBe(401);
    });

    it('should fail if not owner', async () => {
        const res = await request(app)
            .delete(`/api/task/${taskId}`)
            .set('Authorization', `Bearer ${anotherUserToken}`);
        expect(res.status).toBe(403);
    });

    it('should delete successfully', async () => {
        const res = await request(app)
            .delete(`/api/task/${taskId}`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(res.status).toBe(204);
    });
});