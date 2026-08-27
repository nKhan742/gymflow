import { PersonalTrainingService } from '../service/personal-training.service.js';

describe('PersonalTrainingService', () => {
  it('should be defined', () => {
    const service = new PersonalTrainingService();
    expect(service).toBeDefined();
  });
});
