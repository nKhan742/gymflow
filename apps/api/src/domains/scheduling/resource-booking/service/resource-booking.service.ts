import { BaseService } from '../../../../shared/base/BaseService.js';
import { IResourceBookingRepository, ResourceBookingRepository } from '../repository/resource-booking.repository.js';
import { CreateResourceBookingDto, UpdateResourceBookingDto } from '../dto/index.js';
import { ResourceBookingMapper } from '../mapper/resource-booking.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class ResourceBookingService extends BaseService {
  constructor(private readonly repo: IResourceBookingRepository = new ResourceBookingRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateResourceBookingDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return ResourceBookingMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('ResourceBooking record not found');
    return ResourceBookingMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(ResourceBookingMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateResourceBookingDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('ResourceBooking record not found');
    return ResourceBookingMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('ResourceBooking record not found');
    return true;
  }
}
