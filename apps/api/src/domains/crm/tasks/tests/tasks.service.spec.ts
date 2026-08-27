import { TasksService } from '../service/tasks.service.js';

describe('TasksService', () => {
  it('should be defined', () => {
    const service = new TasksService();
    expect(service).toBeDefined();
  });
});
