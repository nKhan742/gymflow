import { BaseService } from '../../../../shared/base/BaseService.js';
import { IInvoicesRepository, InvoicesRepository } from '../repository/invoices.repository.js';
import { CreateInvoicesDto, UpdateInvoicesDto } from '../dto/index.js';
import { InvoicesMapper } from '../mapper/invoices.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class InvoicesService extends BaseService {
  constructor(private readonly repo: IInvoicesRepository = new InvoicesRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateInvoicesDto, createdBy?: string) {
    const invNumber = dto.invoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const items = dto.items && dto.items.length > 0 ? dto.items : [
      {
        description: dto.name || 'Membership Subscription Renewal',
        quantity: 1,
        unitPrice: dto.totalAmount || 899,
        total: dto.totalAmount || 899,
      },
    ];

    const subtotal = dto.subtotal || items.reduce((sum, item) => sum + item.total, 0);
    const tax = dto.tax || 0;
    const discount = dto.discount || 0;
    const totalAmount = dto.totalAmount || subtotal + tax - discount;

    const item = await this.repo.create({
      tenantId: tenantId || 'tenant_enterprise_01',
      branchId: 'branch_hq_01',
      name: dto.name || invNumber,
      code: invNumber,
      description: dto.description || `Invoice for ${dto.memberName || 'Gym Member'}`,
      invoiceNumber: invNumber,
      memberId: dto.memberId || 'mem_default',
      memberName: dto.memberName || 'Sarah Jenkins',
      memberEmail: dto.memberEmail || 'member@example.com',
      items,
      subtotal,
      tax,
      discount,
      totalAmount,
      currency: dto.currency || 'USD',
      paymentMethod: dto.paymentMethod || 'CREDIT_CARD',
      paymentStatus: dto.paymentStatus || 'PAID',
      dueDate: dto.dueDate || new Date().toISOString(),
      paidAt: dto.paidAt || (dto.paymentStatus === 'PAID' ? new Date().toISOString() : undefined),
      status: (dto.status as any) || 'active',
      createdBy: createdBy || 'usr_admin_01',
    });

    return InvoicesMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) {
      // Try finding by invoiceNumber
      const byNumber = await this.repo.findOne({ invoiceNumber: id });
      if (byNumber) return InvoicesMapper.toDTO(byNumber);
      throw new NotFoundException('Invoices record not found');
    }
    return InvoicesMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId: tenantId || 'tenant_enterprise_01' }, pagination);
    return {
      ...result,
      items: result.items.map(InvoicesMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateInvoicesDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Invoices record not found');
    return InvoicesMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Invoices record not found');
    return true;
  }
}
