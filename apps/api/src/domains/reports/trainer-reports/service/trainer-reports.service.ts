import { BaseService } from '../../../../shared/base/BaseService.js';
import { ITrainerReportsRepository, TrainerReportsRepository } from '../repository/trainer-reports.repository.js';
import { CreateTrainerReportsDto, UpdateTrainerReportsDto } from '../dto/index.js';
import { TrainerReportsMapper } from '../mapper/trainer-reports.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class TrainerReportsService extends BaseService {
  constructor(private readonly repo: ITrainerReportsRepository = new TrainerReportsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateTrainerReportsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return TrainerReportsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('TrainerReports record not found');
    return TrainerReportsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(TrainerReportsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateTrainerReportsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('TrainerReports record not found');
    return TrainerReportsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('TrainerReports record not found');
    return true;
  }
}
