const request = require('supertest');
const app = require('../index');
const jwt = require('jsonwebtoken');

const SECRET = 'super-secret';

describe('DELETE /posts/:id', () => {
  const adminToken = jwt.sign({ id: 'u2', role: 'admin' }, SECRET);
  const userToken = jwt.sign({ id: 'u1', role: 'user' }, SECRET);
  const invalidToken = 'badtoken';

  test('✅ Allows admin to delete post', async () => {
    const res = await request(app)
      .delete('/posts/123')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('Post 123 deleted');
  });

  test('❌ Blocks normal user from deleting post', async () => {
    const res = await request(app)
      .delete('/posts/123')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  test('❌ Blocks request with invalid token', async () => {
    const res = await request(app)
      .delete('/posts/123')
      .set('Authorization', `Bearer ${invalidToken}`);
    expect(res.statusCode).toBe(403);
  });

  test('❌ Blocks request with missing token', async () => {
    const res = await request(app).delete('/posts/123');
    expect(res.statusCode).toBe(403);
  });
});
