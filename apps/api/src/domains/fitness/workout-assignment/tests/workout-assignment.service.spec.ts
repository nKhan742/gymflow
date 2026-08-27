import { WorkoutAssignmentService } from '../service/workout-assignment.service.js';

describe('WorkoutAssignmentService', () => {
  it('should be defined', () => {
    const service = new WorkoutAssignmentService();
    expect(service).toBeDefined();
  });
});
