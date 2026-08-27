import { DocumentsService } from '../service/documents.service.js';

describe('DocumentsService', () => {
  it('should be defined', () => {
    const service = new DocumentsService();
    expect(service).toBeDefined();
  });
});
