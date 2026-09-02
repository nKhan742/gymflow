import supertest from 'supertest';
import { createApp } from '../../apps/api/src/app';

describe('Authentication API Endpoint Suite', () => {
  const app = createApp();
  const request = supertest(app);

  it('POST /api/v1/auth/login returns 400 when body is missing credentials', async () => {
    const res = await request
      .post('/api/v1/auth/login')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/auth/refresh returns 400 when refreshToken is missing', async () => {
    const res = await request
      .post('/api/v1/auth/refresh')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
