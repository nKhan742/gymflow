import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IExpensesModel, ExpensesModel } from '../model/expenses.model.js';

export interface IExpensesRepository extends IBaseRepository<IExpensesModel> {}

export class ExpensesRepository extends BaseRepository<IExpensesModel> implements IExpensesRepository {
  constructor() {
    super(ExpensesModel);
  }
}
