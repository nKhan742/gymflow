import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IInvoicesModel, InvoicesModel } from '../model/invoices.model.js';

export interface IInvoicesRepository extends IBaseRepository<IInvoicesModel> {}

export class InvoicesRepository extends BaseRepository<IInvoicesModel> implements IInvoicesRepository {
  constructor() {
    super(InvoicesModel);
  }
}
