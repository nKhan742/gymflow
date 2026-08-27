import { FitnessAssessmentService } from '../service/fitness-assessment.service.js';

describe('FitnessAssessmentService', () => {
  it('should be defined', () => {
    const service = new FitnessAssessmentService();
    expect(service).toBeDefined();
  });
});
