import { BaseService } from '../../../../shared/base/BaseService.js';
import { ISmsRepository, SmsRepository } from '../repository/sms.repository.js';
import { CreateSmsDto, UpdateSmsDto } from '../dto/index.js';
import { SmsMapper } from '../mapper/sms.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class SmsService extends BaseService {
  constructor(private readonly repo: ISmsRepository = new SmsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateSmsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return SmsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Sms record not found');
    return SmsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(SmsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateSmsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Sms record not found');
    return SmsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Sms record not found');
    return true;
  }
}
