import supertest from 'supertest';
import { createApp } from '../../apps/api/src/app';

describe('API Gateway Infrastructure & Health Verification', () => {
  const app = createApp();
  const request = supertest(app);

  it('GET /api/v1/health returns 200 OK with uptime and timestamp', async () => {
    const res = await request.get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.timestamp).toBeDefined();
  });
});
