import { BaseService } from '../../../../shared/base/BaseService.js';
import { IStaffRepository, StaffRepository } from '../repository/staff.repository.js';
import { CreateStaffDto, UpdateStaffDto } from '../dto/index.js';
import { StaffMapper } from '../mapper/staff.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class StaffService extends BaseService {
  constructor(private readonly repo: IStaffRepository = new StaffRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateStaffDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return StaffMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Staff record not found');
    return StaffMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(StaffMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateStaffDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Staff record not found');
    return StaffMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Staff record not found');
    return true;
  }
}
