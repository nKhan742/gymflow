import { BaseService } from '../../../../shared/base/BaseService.js';
import { IWhatsappRepository, WhatsappRepository } from '../repository/whatsapp.repository.js';
import { CreateWhatsappDto, UpdateWhatsappDto } from '../dto/index.js';
import { WhatsappMapper } from '../mapper/whatsapp.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class WhatsappService extends BaseService {
  constructor(private readonly repo: IWhatsappRepository = new WhatsappRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateWhatsappDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return WhatsappMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Whatsapp record not found');
    return WhatsappMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(WhatsappMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateWhatsappDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Whatsapp record not found');
    return WhatsappMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Whatsapp record not found');
    return true;
  }
}
