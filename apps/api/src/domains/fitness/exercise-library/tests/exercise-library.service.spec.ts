import { ExerciseLibraryService } from '../service/exercise-library.service.js';

describe('ExerciseLibraryService', () => {
  it('should be defined', () => {
    const service = new ExerciseLibraryService();
    expect(service).toBeDefined();
  });
});
