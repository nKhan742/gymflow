import { BaseService } from '../../../../shared/base/BaseService.js';
import { IStaffRepository, StaffRepository } from '../repository/staff.repository.js';
import { CreateStaffDto, UpdateStaffDto } from '../dto/index.js';
import { StaffMapper } from '../mapper/staff.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class StaffService extends BaseService {
  constructor(private readonly repo: IStaffRepository = new StaffRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateStaffDto, createdBy?: string) {
    const code = dto.code || (dto.role === 'TRAINER' || dto.role === 'HEAD_COACH' ? `TRN-${Math.floor(100 + Math.random() * 900)}` : `STF-${Math.floor(100 + Math.random() * 900)}`);
    const fullName = dto.name || `${dto.firstName} ${dto.lastName}`.trim();

    const item = await this.repo.create({
      tenantId,
      code,
      name: fullName,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      avatar: dto.avatar || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      bio: dto.bio || '',
      role: dto.role || 'TRAINER',
      department: dto.department || 'FITNESS',
      specializations: dto.specializations || [],
      certifications: dto.certifications || [],
      shift: dto.shift || 'MORNING',
      hourlyRate: dto.hourlyRate ?? 45,
      salary: dto.salary ?? 60000,
      commissionPercentage: dto.commissionPercentage ?? 20,
      hireDate: dto.hireDate || new Date().toISOString().split('T')[0],
      rating: dto.rating ?? 5.0,
      reviewsCount: dto.reviewsCount ?? 0,
      activeClientsCount: dto.activeClientsCount ?? 0,
      workingDays: dto.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      emergencyContact: dto.emergencyContact || { name: '', relationship: '', phone: '' },
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return StaffMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('Staff record not found');
    return StaffMapper.toDTO(item);
  }

  async findAll(tenantId: string, queryFilters?: any, pagination?: IPaginationOptions) {
    const filter: Record<string, unknown> = { tenantId };

    if (queryFilters?.department && queryFilters.department !== 'ALL') {
      filter.department = queryFilters.department;
    }

    if (queryFilters?.role && queryFilters.role !== 'ALL') {
      filter.role = queryFilters.role;
    }

    if (queryFilters?.status && queryFilters.status !== 'ALL') {
      filter.status = queryFilters.status;
    }

    if (queryFilters?.search) {
      const searchRegex = new RegExp(queryFilters.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { code: searchRegex },
        { specializations: { $in: [searchRegex] } },
      ];
    }

    const result = await this.repo.find(filter, pagination);
    return {
      ...result,
      items: result.items.map(StaffMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateStaffDto, updatedBy?: string) {
    const updatePayload: Record<string, any> = { ...dto, updatedBy };
    if (dto.firstName || dto.lastName) {
      const current = await this.repo.findById(id, tenantId);
      const first = dto.firstName || current?.firstName || '';
      const last = dto.lastName || current?.lastName || '';
      updatePayload.name = `${first} ${last}`.trim();
    }

    const item = await this.repo.updateById(id, updatePayload, tenantId);
    if (!item) throw new NotFoundException('Staff record not found');
    return StaffMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('Staff record not found');
    return true;
  }
}
