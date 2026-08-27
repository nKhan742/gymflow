import { BaseService } from '../../../../shared/base/BaseService.js';
import { ICampaignsRepository, CampaignsRepository } from '../repository/campaigns.repository.js';
import { CreateCampaignsDto, UpdateCampaignsDto } from '../dto/index.js';
import { CampaignsMapper } from '../mapper/campaigns.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class CampaignsService extends BaseService {
  constructor(private readonly repo: ICampaignsRepository = new CampaignsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateCampaignsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return CampaignsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Campaigns record not found');
    return CampaignsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(CampaignsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateCampaignsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Campaigns record not found');
    return CampaignsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Campaigns record not found');
    return true;
  }
}
