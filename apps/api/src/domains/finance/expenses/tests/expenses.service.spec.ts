import { ExpensesService } from '../service/expenses.service.js';

describe('ExpensesService', () => {
  it('should be defined', () => {
    const service = new ExpensesService();
    expect(service).toBeDefined();
  });
});
