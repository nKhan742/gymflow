import { BaseService } from '../../../../shared/base/BaseService.js';
import { IPaymentsRepository, PaymentsRepository } from '../repository/payments.repository.js';
import { CreatePaymentsDto, UpdatePaymentsDto } from '../dto/index.js';
import { PaymentsMapper } from '../mapper/payments.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class PaymentsService extends BaseService {
  constructor(private readonly repo: IPaymentsRepository = new PaymentsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreatePaymentsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return PaymentsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Payments record not found');
    return PaymentsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(PaymentsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdatePaymentsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Payments record not found');
    return PaymentsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Payments record not found');
    return true;
  }
}
