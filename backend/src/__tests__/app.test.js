const request = require('supertest');
const app = require('../app');

describe('Health endpoint', () => {
  it('GET /health returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Menu endpoints', () => {
  it('GET /menu returns array of items', async () => {
    const res = await request(app).get('/menu');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /menu/:id returns a single item', async () => {
    const res = await request(app).get('/menu/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.name).toBe('Espresso');
  });

  it('GET /menu/:id returns 404 for unknown id', async () => {
    const res = await request(app).get('/menu/999');
    expect(res.statusCode).toBe(404);
  });
});
