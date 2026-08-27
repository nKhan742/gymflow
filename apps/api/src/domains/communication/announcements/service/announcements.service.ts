import { BaseService } from '../../../../shared/base/BaseService.js';
import { IAnnouncementsRepository, AnnouncementsRepository } from '../repository/announcements.repository.js';
import { CreateAnnouncementsDto, UpdateAnnouncementsDto } from '../dto/index.js';
import { AnnouncementsMapper } from '../mapper/announcements.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class AnnouncementsService extends BaseService {
  constructor(private readonly repo: IAnnouncementsRepository = new AnnouncementsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateAnnouncementsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return AnnouncementsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Announcements record not found');
    return AnnouncementsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(AnnouncementsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateAnnouncementsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Announcements record not found');
    return AnnouncementsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Announcements record not found');
    return true;
  }
}
