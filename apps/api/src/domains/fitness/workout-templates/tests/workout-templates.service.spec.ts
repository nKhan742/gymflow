import { WorkoutTemplatesService } from '../service/workout-templates.service.js';

describe('WorkoutTemplatesService', () => {
  it('should be defined', () => {
    const service = new WorkoutTemplatesService();
    expect(service).toBeDefined();
  });
});
