import { BaseService } from '../../../../shared/base/BaseService.js';
import { IDepartmentsRepository, DepartmentsRepository } from '../repository/departments.repository.js';
import { CreateDepartmentsDto, UpdateDepartmentsDto } from '../dto/index.js';
import { DepartmentsMapper } from '../mapper/departments.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class DepartmentsService extends BaseService {
  constructor(private readonly repo: IDepartmentsRepository = new DepartmentsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateDepartmentsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      ...(dto as any),
      createdBy,
    });
    return DepartmentsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Departments record not found');
    return DepartmentsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(DepartmentsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateDepartmentsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...(dto as any), updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Departments record not found');
    return DepartmentsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Departments record not found');
    return true;
  }
}
