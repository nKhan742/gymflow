import { WorkoutPlansService } from '../service/workout-plans.service.js';

describe('WorkoutPlansService', () => {
  it('should be defined', () => {
    const service = new WorkoutPlansService();
    expect(service).toBeDefined();
  });
});
