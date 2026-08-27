import { BaseService } from '../../../../shared/base/BaseService.js';
import { IPersonalTrainingRepository, PersonalTrainingRepository } from '../repository/personal-training.repository.js';
import { CreatePersonalTrainingDto, UpdatePersonalTrainingDto } from '../dto/index.js';
import { PersonalTrainingMapper } from '../mapper/personal-training.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class PersonalTrainingService extends BaseService {
  constructor(private readonly repo: IPersonalTrainingRepository = new PersonalTrainingRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreatePersonalTrainingDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return PersonalTrainingMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('PersonalTraining record not found');
    return PersonalTrainingMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(PersonalTrainingMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdatePersonalTrainingDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('PersonalTraining record not found');
    return PersonalTrainingMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('PersonalTraining record not found');
    return true;
  }
}
