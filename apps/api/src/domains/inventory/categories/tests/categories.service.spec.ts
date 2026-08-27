import { CategoriesService } from '../service/categories.service.js';

describe('CategoriesService', () => {
  it('should be defined', () => {
    const service = new CategoriesService();
    expect(service).toBeDefined();
  });
});
