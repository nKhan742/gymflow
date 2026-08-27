import { BaseService } from '../../../../shared/base/BaseService.js';
import { IPreferencesRepository, PreferencesRepository } from '../repository/preferences.repository.js';
import { CreatePreferencesDto, UpdatePreferencesDto } from '../dto/index.js';
import { PreferencesMapper } from '../mapper/preferences.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class PreferencesService extends BaseService {
  constructor(private readonly repo: IPreferencesRepository = new PreferencesRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreatePreferencesDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return PreferencesMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Preferences record not found');
    return PreferencesMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(PreferencesMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdatePreferencesDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Preferences record not found');
    return PreferencesMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Preferences record not found');
    return true;
  }
}
