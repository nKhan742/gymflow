import { DepartmentsService } from '../service/departments.service.js';

describe('DepartmentsService', () => {
  it('should be defined', () => {
    const service = new DepartmentsService();
    expect(service).toBeDefined();
  });
});
