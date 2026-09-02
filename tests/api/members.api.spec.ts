import supertest from 'supertest';
import { createApp } from '../../apps/api/src/app';
import { DatabaseConnection } from '../../apps/api/src/database/connection';

describe('Members & Subscriptions API Suite', () => {
  const app = createApp();
  const request = supertest(app);

  beforeAll(async () => {
    try {
      await DatabaseConnection.connect();
    } catch {}
  });

  afterAll(async () => {
    try {
      await DatabaseConnection.disconnect();
    } catch {}
  });

  it('GET /api/v1/members/members returns 200 with members list', async () => {
    const res = await request.get('/api/v1/members/members');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const items = Array.isArray(res.body.data) ? res.body.data : res.body.data?.items;
    expect(Array.isArray(items)).toBe(true);
  });

  it('GET /api/v1/members/membership-plans returns 200 with plan list', async () => {
    const res = await request.get('/api/v1/members/membership-plans');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const items = Array.isArray(res.body.data) ? res.body.data : res.body.data?.items;
    expect(Array.isArray(items)).toBe(true);
  });
});

