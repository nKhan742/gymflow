import { BaseService } from '../../../../shared/base/BaseService.js';
import { IWalletRepository, WalletRepository } from '../repository/wallet.repository.js';
import { CreateWalletDto, UpdateWalletDto } from '../dto/index.js';
import { WalletMapper } from '../mapper/wallet.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class WalletService extends BaseService {
  constructor(private readonly repo: IWalletRepository = new WalletRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateWalletDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return WalletMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Wallet record not found');
    return WalletMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(WalletMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateWalletDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('Wallet record not found');
    return WalletMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Wallet record not found');
    return true;
  }
}
