const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Health endpoint', () => {
  it('GET /health returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Menu endpoints', () => {
  it('GET /drinks returns array', async () => {
    const res = await request(app).get('/drinks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /mugs returns array', async () => {
    const res = await request(app).get('/mugs');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /foods returns array', async () => {
    const res = await request(app).get('/foods');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('Auth endpoints', () => {
  // Use a unique email per test run to avoid duplicate-key conflicts
  const testEmail = `test_${Date.now()}@brewtest.com`;
  const testPassword = 'testpass123';
  let createdUserId;

  it('POST /register creates a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({ name: 'Test User', email: testEmail, password: testPassword });
    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe(testEmail);
    expect(res.body._id).toBeDefined();
    createdUserId = res.body._id;
  });

  it('POST /register returns 400 for duplicate email', async () => {
    const res = await request(app)
      .post('/register')
      .send({ name: 'Duplicate', email: testEmail, password: testPassword });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /login returns user for valid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: testEmail, password: testPassword });
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(testEmail);
  });

  it('POST /login returns 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: testEmail, password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('GET /user/:id returns the user', async () => {
    const res = await request(app).get(`/user/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(createdUserId);
  });

  it('GET /user/:id returns 400 for invalid id', async () => {
    const res = await request(app).get('/user/invalid-id');
    expect(res.statusCode).toBe(400);
  });

  it('PUT /user/:id updates the user', async () => {
    const res = await request(app)
      .put(`/user/${createdUserId}`)
      .send({ stars: 15 });
    expect(res.statusCode).toBe(200);
    expect(res.body.stars).toBe(15);
  });
});

describe('Order endpoints', () => {
  let createdOrderUserId;

  it('POST /orders creates a new order', async () => {
    createdOrderUserId = `user_${Date.now()}`;
    const res = await request(app)
      .post('/orders')
      .send({ userId: createdOrderUserId, itemCount: 2, total: 164, stars: 2 });
    expect(res.statusCode).toBe(201);
    expect(res.body.userId).toBe(createdOrderUserId);
    expect(res.body._id).toBeDefined();
  });

  it('GET /orders/:userId returns orders for a user', async () => {
    const res = await request(app).get(`/orders/${createdOrderUserId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /orders/:userId returns empty array for unknown user', async () => {
    const res = await request(app).get('/orders/nonexistent_user_xyz');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});
