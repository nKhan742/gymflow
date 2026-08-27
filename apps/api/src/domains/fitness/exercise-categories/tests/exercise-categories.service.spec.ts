import { ExerciseCategoriesService } from '../service/exercise-categories.service.js';

describe('ExerciseCategoriesService', () => {
  it('should be defined', () => {
    const service = new ExerciseCategoriesService();
    expect(service).toBeDefined();
  });
});
