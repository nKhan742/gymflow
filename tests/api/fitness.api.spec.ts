import supertest from 'supertest';
import { createApp } from '../../apps/api/src/app';
import { DatabaseConnection } from '../../apps/api/src/database/connection';

describe('Fitness & Workouts API Suite', () => {
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

  it('GET /api/v1/fitness/exercise-categories returns 200 with category list', async () => {
    const res = await request.get('/api/v1/fitness/exercise-categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/v1/fitness/workout-templates returns 200 with template list', async () => {
    const res = await request.get('/api/v1/fitness/workout-templates');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

