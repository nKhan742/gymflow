import { BaseService } from '../../../../shared/base/BaseService.js';
import { ITrialMembersRepository, TrialMembersRepository } from '../repository/trial-members.repository.js';
import { CreateTrialMembersDto, UpdateTrialMembersDto } from '../dto/index.js';
import { TrialMembersMapper } from '../mapper/trial-members.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class TrialMembersService extends BaseService {
  constructor(private readonly repo: ITrialMembersRepository = new TrialMembersRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateTrialMembersDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return TrialMembersMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('TrialMembers record not found');
    return TrialMembersMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(TrialMembersMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateTrialMembersDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('TrialMembers record not found');
    return TrialMembersMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('TrialMembers record not found');
    return true;
  }
}
