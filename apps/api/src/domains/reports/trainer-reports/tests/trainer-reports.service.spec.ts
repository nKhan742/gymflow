import { TrainerReportsService } from '../service/trainer-reports.service.js';

describe('TrainerReportsService', () => {
  it('should be defined', () => {
    const service = new TrainerReportsService();
    expect(service).toBeDefined();
  });
});
