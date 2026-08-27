import { BaseService } from '../../../../shared/base/BaseService.js';
import { IMembershipRenewalsRepository, MembershipRenewalsRepository } from '../repository/membership-renewals.repository.js';
import { CreateMembershipRenewalsDto, UpdateMembershipRenewalsDto } from '../dto/index.js';
import { MembershipRenewalsMapper } from '../mapper/membership-renewals.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class MembershipRenewalsService extends BaseService {
  constructor(private readonly repo: IMembershipRenewalsRepository = new MembershipRenewalsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateMembershipRenewalsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return MembershipRenewalsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('MembershipRenewals record not found');
    return MembershipRenewalsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(MembershipRenewalsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateMembershipRenewalsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('MembershipRenewals record not found');
    return MembershipRenewalsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('MembershipRenewals record not found');
    return true;
  }
}
