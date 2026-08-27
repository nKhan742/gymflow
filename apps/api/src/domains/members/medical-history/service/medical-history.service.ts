import { BaseService } from '../../../../shared/base/BaseService.js';
import { IMedicalHistoryRepository, MedicalHistoryRepository } from '../repository/medical-history.repository.js';
import { CreateMedicalHistoryDto, UpdateMedicalHistoryDto } from '../dto/index.js';
import { MedicalHistoryMapper } from '../mapper/medical-history.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class MedicalHistoryService extends BaseService {
  constructor(private readonly repo: IMedicalHistoryRepository = new MedicalHistoryRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateMedicalHistoryDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return MedicalHistoryMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('MedicalHistory record not found');
    return MedicalHistoryMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(MedicalHistoryMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateMedicalHistoryDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('MedicalHistory record not found');
    return MedicalHistoryMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('MedicalHistory record not found');
    return true;
  }
}
