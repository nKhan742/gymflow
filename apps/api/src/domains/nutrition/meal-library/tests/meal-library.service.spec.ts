import { MealLibraryService } from '../service/meal-library.service.js';

describe('MealLibraryService', () => {
  it('should be defined', () => {
    const service = new MealLibraryService();
    expect(service).toBeDefined();
  });
});
