import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IDocumentsModel, DocumentsModel } from '../model/documents.model.js';

export interface IDocumentsRepository extends IBaseRepository<IDocumentsModel> {}

export class DocumentsRepository extends BaseRepository<IDocumentsModel> implements IDocumentsRepository {
  constructor() {
    super(DocumentsModel);
  }
}
