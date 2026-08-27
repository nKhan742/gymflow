import { BaseService } from '../../../../shared/base/BaseService.js';
import { IExpensesRepository, ExpensesRepository } from '../repository/expenses.repository.js';
import { CreateExpensesDto, UpdateExpensesDto } from '../dto/index.js';
import { ExpensesMapper } from '../mapper/expenses.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class ExpensesService extends BaseService {
  constructor(private readonly repo: IExpensesRepository = new ExpensesRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateExpensesDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return ExpensesMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Expenses record not found');
    return ExpensesMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(ExpensesMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateExpensesDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Expenses record not found');
    return ExpensesMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Expenses record not found');
    return true;
  }
}
