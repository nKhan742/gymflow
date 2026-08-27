import { BaseService } from '../../../../shared/base/BaseService.js';
import { INotificationsRepository, NotificationsRepository } from '../repository/notifications.repository.js';
import { CreateNotificationsDto, UpdateNotificationsDto } from '../dto/index.js';
import { NotificationsMapper } from '../mapper/notifications.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class NotificationsService extends BaseService {
  constructor(private readonly repo: INotificationsRepository = new NotificationsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateNotificationsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return NotificationsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Notifications record not found');
    return NotificationsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(NotificationsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateNotificationsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Notifications record not found');
    return NotificationsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Notifications record not found');
    return true;
  }
}
