import { BaseService } from '../../../../shared/base/BaseService.js';
import { IMembershipPlansRepository, MembershipPlansRepository } from '../repository/membership-plans.repository.js';
import { CreateMembershipPlansDto, UpdateMembershipPlansDto } from '../dto/index.js';
import { MembershipPlansMapper } from '../mapper/membership-plans.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class MembershipPlansService extends BaseService {
  constructor(private readonly repo: IMembershipPlansRepository = new MembershipPlansRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateMembershipPlansDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return MembershipPlansMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('MembershipPlans record not found');
    return MembershipPlansMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(MembershipPlansMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateMembershipPlansDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('MembershipPlans record not found');
    return MembershipPlansMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('MembershipPlans record not found');
    return true;
  }
}
