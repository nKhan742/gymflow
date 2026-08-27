import { BaseService } from '../../../../shared/base/BaseService.js';
import { IEquipmentRepository, EquipmentRepository } from '../repository/equipment.repository.js';
import { CreateEquipmentDto, UpdateEquipmentDto } from '../dto/index.js';
import { EquipmentMapper } from '../mapper/equipment.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class EquipmentService extends BaseService {
  constructor(private readonly repo: IEquipmentRepository = new EquipmentRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateEquipmentDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return EquipmentMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Equipment record not found');
    return EquipmentMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(EquipmentMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateEquipmentDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Equipment record not found');
    return EquipmentMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Equipment record not found');
    return true;
  }
}
