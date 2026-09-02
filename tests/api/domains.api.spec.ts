import supertest from 'supertest';
import { createApp } from '../../apps/api/src/app';
import { DatabaseConnection } from '../../apps/api/src/database/connection';

describe('Protected Domain API Endpoints Suite', () => {
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

  it('GET /api/v1/gym/branches returns 200 with an array format', async () => {
    const res = await request.get('/api/v1/gym/branches');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/finance/invoices returns 200 with invoice items', async () => {
    const res = await request.get('/api/v1/finance/invoices');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/v1/member-management/attendance returns 200 with attendance items', async () => {
    const res = await request.get('/api/v1/member-management/attendance');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
