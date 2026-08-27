import { BaseService } from '../../../../shared/base/BaseService.js';
import { IWorkoutTemplatesRepository, WorkoutTemplatesRepository } from '../repository/workout-templates.repository.js';
import { CreateWorkoutTemplatesDto, UpdateWorkoutTemplatesDto } from '../dto/index.js';
import { WorkoutTemplatesMapper } from '../mapper/workout-templates.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class WorkoutTemplatesService extends BaseService {
  constructor(private readonly repo: IWorkoutTemplatesRepository = new WorkoutTemplatesRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateWorkoutTemplatesDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return WorkoutTemplatesMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('WorkoutTemplates record not found');
    return WorkoutTemplatesMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(WorkoutTemplatesMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateWorkoutTemplatesDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('WorkoutTemplates record not found');
    return WorkoutTemplatesMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('WorkoutTemplates record not found');
    return true;
  }
}
