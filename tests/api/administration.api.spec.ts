import supertest from 'supertest';
import { createApp } from '../../apps/api/src/app';
import { DatabaseConnection } from '../../apps/api/src/database/connection';

describe('Administration & Settings API Suite', () => {
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

  it('GET /api/v1/administration/users returns 200 with users list', async () => {
    const res = await request.get('/api/v1/administration/users');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/administration/roles returns 200 with roles list', async () => {
    const res = await request.get('/api/v1/administration/roles');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

