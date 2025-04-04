process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Task = require('../models/task');
const jwt = require('jsonwebtoken');

const fakeUserId = new mongoose.Types.ObjectId();
const token = jwt.sign({id: fakeUserId.toString()},
    process.env.JWT_SECRET || 'testsecret');

describe('Task API', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/taskmaster_test');
  });

  afterEach(async () => {
    await Task.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should reject task without title', async () => {
    const res = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({description: 'No title'});

    expect(res.statusCode).toBe(400);
    expect(res.body.errors.title).toMatch(/title is required/i);
  });

  it('should create a new task', async () => {
    const res = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({title: 'Test Task', description: 'A task'});

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Task');
  });

  it('should fetch tasks for user', async () => {
    await Task.create({title: 'My Task', user: fakeUserId});

    const res = await request(app)
    .get('/api/tasks')
    .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('My Task');
  });

  it('should update a task', async () => {
    const task = await Task.create({title: 'Old', user: fakeUserId});

    const res = await request(app)
    .put(`/api/tasks/${task._id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({title: 'Updated Title'});

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('should delete a task', async () => {
    const task = await Task.create({title: 'Delete Me', user: fakeUserId});
    const res = await request(app)
    .delete(`/api/tasks/${task._id}`)
    .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it('should not delete task of another user', async () => {
    const otherTask = await Task.create(
        {title: 'Not Yours', user: new mongoose.Types.ObjectId()});

    const res = await request(app)
    .delete(`/api/tasks/${otherTask._id}`)
    .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

});