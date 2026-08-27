import { BaseService } from '../../../../shared/base/BaseService.js';
import { IWorkoutPlansRepository, WorkoutPlansRepository } from '../repository/workout-plans.repository.js';
import { CreateWorkoutPlansDto, UpdateWorkoutPlansDto } from '../dto/index.js';
import { WorkoutPlansMapper } from '../mapper/workout-plans.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class WorkoutPlansService extends BaseService {
  constructor(private readonly repo: IWorkoutPlansRepository = new WorkoutPlansRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateWorkoutPlansDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return WorkoutPlansMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('WorkoutPlans record not found');
    return WorkoutPlansMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(WorkoutPlansMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateWorkoutPlansDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('WorkoutPlans record not found');
    return WorkoutPlansMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('WorkoutPlans record not found');
    return true;
  }
}
