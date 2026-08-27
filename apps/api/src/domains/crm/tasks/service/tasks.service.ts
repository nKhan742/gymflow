import { BaseService } from '../../../../shared/base/BaseService.js';
import { ITasksRepository, TasksRepository } from '../repository/tasks.repository.js';
import { CreateTasksDto, UpdateTasksDto } from '../dto/index.js';
import { TasksMapper } from '../mapper/tasks.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class TasksService extends BaseService {
  constructor(private readonly repo: ITasksRepository = new TasksRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateTasksDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return TasksMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Tasks record not found');
    return TasksMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(TasksMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateTasksDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Tasks record not found');
    return TasksMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Tasks record not found');
    return true;
  }
}
