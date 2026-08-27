import { BaseService } from '../../../../shared/base/BaseService.js';
import { IMyProfileRepository, MyProfileRepository } from '../repository/my-profile.repository.js';
import { CreateMyProfileDto, UpdateMyProfileDto } from '../dto/index.js';
import { MyProfileMapper } from '../mapper/my-profile.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class MyProfileService extends BaseService {
  constructor(private readonly repo: IMyProfileRepository = new MyProfileRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateMyProfileDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return MyProfileMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('MyProfile record not found');
    return MyProfileMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(MyProfileMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateMyProfileDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('MyProfile record not found');
    return MyProfileMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('MyProfile record not found');
    return true;
  }
}
