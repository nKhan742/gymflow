import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IPaymentsModel, PaymentsModel } from '../model/payments.model.js';

export interface IPaymentsRepository extends IBaseRepository<IPaymentsModel> {}

export class PaymentsRepository extends BaseRepository<IPaymentsModel> implements IPaymentsRepository {
  constructor() {
    super(PaymentsModel);
  }
}
