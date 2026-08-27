import { BaseService } from '../../../../shared/base/BaseService.js';
import { IWorkoutAssignmentRepository, WorkoutAssignmentRepository } from '../repository/workout-assignment.repository.js';
import { CreateWorkoutAssignmentDto, UpdateWorkoutAssignmentDto } from '../dto/index.js';
import { WorkoutAssignmentMapper } from '../mapper/workout-assignment.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class WorkoutAssignmentService extends BaseService {
  constructor(private readonly repo: IWorkoutAssignmentRepository = new WorkoutAssignmentRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateWorkoutAssignmentDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return WorkoutAssignmentMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('WorkoutAssignment record not found');
    return WorkoutAssignmentMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(WorkoutAssignmentMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateWorkoutAssignmentDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('WorkoutAssignment record not found');
    return WorkoutAssignmentMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('WorkoutAssignment record not found');
    return true;
  }
}
