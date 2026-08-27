import { DocumentsApi } from '../api';

export class DocumentsService {
  static async getList() {
    return DocumentsApi.getAll();
  }
}
