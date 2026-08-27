import { BaseService } from '../../../../shared/base/BaseService.js';
import { IExerciseLibraryRepository, ExerciseLibraryRepository } from '../repository/exercise-library.repository.js';
import { CreateExerciseLibraryDto, UpdateExerciseLibraryDto } from '../dto/index.js';
import { ExerciseLibraryMapper } from '../mapper/exercise-library.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class ExerciseLibraryService extends BaseService {
  constructor(private readonly repo: IExerciseLibraryRepository = new ExerciseLibraryRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateExerciseLibraryDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return ExerciseLibraryMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('ExerciseLibrary record not found');
    return ExerciseLibraryMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(ExerciseLibraryMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateExerciseLibraryDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('ExerciseLibrary record not found');
    return ExerciseLibraryMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('ExerciseLibrary record not found');
    return true;
  }
}
