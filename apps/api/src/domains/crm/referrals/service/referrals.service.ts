import { BaseService } from '../../../../shared/base/BaseService.js';
import { IReferralsRepository, ReferralsRepository } from '../repository/referrals.repository.js';
import { CreateReferralsDto, UpdateReferralsDto } from '../dto/index.js';
import { ReferralsMapper } from '../mapper/referrals.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class ReferralsService extends BaseService {
  constructor(private readonly repo: IReferralsRepository = new ReferralsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateReferralsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return ReferralsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Referrals record not found');
    return ReferralsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(ReferralsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateReferralsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Referrals record not found');
    return ReferralsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Referrals record not found');
    return true;
  }
}
