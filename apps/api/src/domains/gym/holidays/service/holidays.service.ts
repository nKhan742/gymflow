import { BaseService } from '../../../../shared/base/BaseService.js';
import { IHolidaysRepository, HolidaysRepository } from '../repository/holidays.repository.js';
import { CreateHolidaysDto, UpdateHolidaysDto } from '../dto/index.js';
import { HolidaysMapper } from '../mapper/holidays.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class HolidaysService extends BaseService {
  constructor(private readonly repo: IHolidaysRepository = new HolidaysRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateHolidaysDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return HolidaysMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Holidays record not found');
    return HolidaysMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(HolidaysMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateHolidaysDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Holidays record not found');
    return HolidaysMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Holidays record not found');
    return true;
  }
}
