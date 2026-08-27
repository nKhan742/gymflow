import { BaseService } from '../../../../shared/base/BaseService.js';
import { ISalaryRepository, SalaryRepository } from '../repository/salary.repository.js';
import { CreateSalaryDto, UpdateSalaryDto } from '../dto/index.js';
import { SalaryMapper } from '../mapper/salary.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class SalaryService extends BaseService {
  constructor(private readonly repo: ISalaryRepository = new SalaryRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateSalaryDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return SalaryMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Salary record not found');
    return SalaryMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(SalaryMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateSalaryDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Salary record not found');
    return SalaryMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Salary record not found');
    return true;
  }
}
