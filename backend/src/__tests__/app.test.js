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
  let token;

  it('POST /register creates a new user and returns a token', async () => {
    const res = await request(app)
      .post('/register')
      .send({ name: 'Test User', email: testEmail, password: testPassword });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.user._id).toBeDefined();
    expect(res.body.token).toBeDefined();
    createdUserId = res.body.user._id;
    token = res.body.token;
  });

  it('never returns the password field', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: testEmail, password: testPassword });
    expect(res.body.user.password).toBeUndefined();
  });

  it('POST /register returns 400 for duplicate email', async () => {
    const res = await request(app)
      .post('/register')
      .send({ name: 'Duplicate', email: testEmail, password: testPassword });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /login returns user + token for valid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: testEmail, password: testPassword });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.token).toBeDefined();
  });

  it('POST /login returns 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: testEmail, password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('POST /login rejects NoSQL operator payloads (no auth bypass)', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: { $ne: null }, password: { $ne: null } });
    expect(res.statusCode).toBe(400);
  });

  it('GET /user/:id requires authentication', async () => {
    const res = await request(app).get(`/user/${createdUserId}`);
    expect(res.statusCode).toBe(401);
  });

  it('GET /user/:id returns the user when authenticated', async () => {
    const res = await request(app)
      .get(`/user/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(createdUserId);
    expect(res.body.password).toBeUndefined();
  });

  it('GET /user/:id returns 403 for a different user id', async () => {
    const otherId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get(`/user/${otherId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });

  it('PUT /user/:id updates the user', async () => {
    const res = await request(app)
      .put(`/user/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ stars: 15 });
    expect(res.statusCode).toBe(200);
    expect(res.body.stars).toBe(15);
  });

  it('PUT /user/:id ignores attempts to change the password', async () => {
    await request(app)
      .put(`/user/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'hacked-in-plaintext' });
    // old password still works, new one does not
    const good = await request(app)
      .post('/login')
      .send({ email: testEmail, password: testPassword });
    expect(good.statusCode).toBe(200);
    const bad = await request(app)
      .post('/login')
      .send({ email: testEmail, password: 'hacked-in-plaintext' });
    expect(bad.statusCode).toBe(401);
  });

  it('POST /user/:id/password changes the password after verifying the current one', async () => {
    const wrong = await request(app)
      .post(`/user/${createdUserId}/password`)
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'nope', newPassword: 'brandnew123' });
    expect(wrong.statusCode).toBe(401);

    const ok = await request(app)
      .post(`/user/${createdUserId}/password`)
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: testPassword, newPassword: 'brandnew123' });
    expect(ok.statusCode).toBe(200);

    const login = await request(app)
      .post('/login')
      .send({ email: testEmail, password: 'brandnew123' });
    expect(login.statusCode).toBe(200);
  });
});

describe('Order endpoints', () => {
  let token;
  let userId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/register')
      .send({ name: 'Order User', email: `order_${Date.now()}@brewtest.com`, password: 'orderpass123' });
    token = res.body.token;
    userId = res.body.user._id;
  });

  it('POST /orders requires authentication', async () => {
    const res = await request(app).post('/orders').send({ itemCount: 1, total: 50, stars: 1 });
    expect(res.statusCode).toBe(401);
  });

  it('POST /orders creates an order bound to the authenticated user', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'someone-else', itemCount: 2, total: 164, stars: 2 });
    expect(res.statusCode).toBe(201);
    expect(res.body.userId).toBe(userId);
    expect(res.body._id).toBeDefined();
  });

  it('GET /orders/:userId returns orders for the authenticated user', async () => {
    const res = await request(app)
      .get(`/orders/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /orders/:userId returns 403 for another user', async () => {
    const otherId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get(`/orders/${otherId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });
});
