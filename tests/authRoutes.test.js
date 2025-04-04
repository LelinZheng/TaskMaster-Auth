const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user');

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/taskmaster_test');
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/api/register').send({
      username: 'lelin',
      email: 'lelin@example.com',
      password: '123456'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('should reject duplicate email', async () => {
    await User.create({ username: 'a', email: 'dupe@example.com', password: 'pass' });

    const res = await request(app).post('/api/register').send({
      username: 'b',
      email: 'dupe@example.com',
      password: '123456'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/already taken/i);
  });

  it('should login with correct credentials', async () => {
    await request(app).post('/api/register').send({
      username: 'test',
      email: 'login@example.com',
      password: 'mypassword'
    });

    const res = await request(app).post('/api/login').send({
      email: 'login@example.com',
      password: 'mypassword'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    await request(app).post('/api/register').send({
      username: 'test',
      email: 'wrongpass@example.com',
      password: 'rightpass'
    });

    const res = await request(app).post('/api/login').send({
      email: 'wrongpass@example.com',
      password: 'wrongpass'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });
});