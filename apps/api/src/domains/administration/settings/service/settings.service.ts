import { BaseService } from '../../../../shared/base/BaseService.js';
import { ISettingsRepository, SettingsRepository } from '../repository/settings.repository.js';
import { CreateSettingsDto, UpdateSettingsDto } from '../dto/index.js';
import { SettingsMapper } from '../mapper/settings.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class SettingsService extends BaseService {
  constructor(private readonly repo: ISettingsRepository = new SettingsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateSettingsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return SettingsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Settings record not found');
    return SettingsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(SettingsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateSettingsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Settings record not found');
    return SettingsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Settings record not found');
    return true;
  }
}
