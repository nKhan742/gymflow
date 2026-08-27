import { BaseService } from '../../../../shared/base/BaseService.js';
import { IWaterIntakeRepository, WaterIntakeRepository } from '../repository/water-intake.repository.js';
import { CreateWaterIntakeDto, UpdateWaterIntakeDto } from '../dto/index.js';
import { WaterIntakeMapper } from '../mapper/water-intake.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class WaterIntakeService extends BaseService {
  constructor(private readonly repo: IWaterIntakeRepository = new WaterIntakeRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateWaterIntakeDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return WaterIntakeMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('WaterIntake record not found');
    return WaterIntakeMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(WaterIntakeMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateWaterIntakeDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('WaterIntake record not found');
    return WaterIntakeMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('WaterIntake record not found');
    return true;
  }
}
