import { BaseService } from '../../../../shared/base/BaseService.js';
import { ICalendarRepository, CalendarRepository } from '../repository/calendar.repository.js';
import { CreateCalendarDto, UpdateCalendarDto } from '../dto/index.js';
import { CalendarMapper } from '../mapper/calendar.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class CalendarService extends BaseService {
  constructor(private readonly repo: ICalendarRepository = new CalendarRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateCalendarDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return CalendarMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Calendar record not found');
    return CalendarMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(CalendarMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateCalendarDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Calendar record not found');
    return CalendarMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Calendar record not found');
    return true;
  }
}
