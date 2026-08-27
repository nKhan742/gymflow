import { BaseService } from '../../../../shared/base/BaseService.js';
import { IFitnessAssessmentRepository, FitnessAssessmentRepository } from '../repository/fitness-assessment.repository.js';
import { CreateFitnessAssessmentDto, UpdateFitnessAssessmentDto } from '../dto/index.js';
import { FitnessAssessmentMapper } from '../mapper/fitness-assessment.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class FitnessAssessmentService extends BaseService {
  constructor(private readonly repo: IFitnessAssessmentRepository = new FitnessAssessmentRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateFitnessAssessmentDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return FitnessAssessmentMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('FitnessAssessment record not found');
    return FitnessAssessmentMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(FitnessAssessmentMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateFitnessAssessmentDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('FitnessAssessment record not found');
    return FitnessAssessmentMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('FitnessAssessment record not found');
    return true;
  }
}
