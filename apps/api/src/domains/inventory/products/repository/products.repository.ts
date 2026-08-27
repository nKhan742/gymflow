import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IProductsModel, ProductsModel } from '../model/products.model.js';

export interface IProductsRepository extends IBaseRepository<IProductsModel> {}

export class ProductsRepository extends BaseRepository<IProductsModel> implements IProductsRepository {
  constructor() {
    super(ProductsModel);
  }
}
