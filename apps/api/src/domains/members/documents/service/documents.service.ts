import { BaseService } from '../../../../shared/base/BaseService.js';
import { IDocumentsRepository, DocumentsRepository } from '../repository/documents.repository.js';
import { CreateDocumentsDto, UpdateDocumentsDto } from '../dto/index.js';
import { DocumentsMapper } from '../mapper/documents.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class DocumentsService extends BaseService {
  constructor(private readonly repo: IDocumentsRepository = new DocumentsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateDocumentsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return DocumentsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Documents record not found');
    return DocumentsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(DocumentsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateDocumentsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Documents record not found');
    return DocumentsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Documents record not found');
    return true;
  }
}
