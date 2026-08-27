import { TrainerScheduleService } from '../service/trainer-schedule.service.js';

describe('TrainerScheduleService', () => {
  it('should be defined', () => {
    const service = new TrainerScheduleService();
    expect(service).toBeDefined();
  });
});
