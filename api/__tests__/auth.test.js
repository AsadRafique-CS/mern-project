// __tests__/auth.test.js
const request = require('supertest');
const app = require('../index');

describe('Role-based Access Control', () => {
  let adminToken, userToken;

  beforeAll(async () => {
    const adminRes = await request(app).post('/login').send({ id: 'u2' });
    const userRes = await request(app).post('/login').send({ id: 'u1' });

    adminToken = adminRes.body.token;
    userToken = userRes.body.token;
  });

  test('1. Admin can delete post ✅', async () => {
    const res = await request(app)
      .delete('/posts/123')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test('2. Normal user is forbidden ❌', async () => {
    const res = await request(app)
      .delete('/posts/123')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/forbidden/i);
  });

  test('3. Missing token returns 403 ❌', async () => {
    const res = await request(app).delete('/posts/123');
    expect(res.statusCode).toBe(403);
  });
});
