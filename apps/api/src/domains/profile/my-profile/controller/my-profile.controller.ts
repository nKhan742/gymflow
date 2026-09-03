import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { MyProfileService } from '../service/my-profile.service.js';
import { TenantDatabaseManager } from '../../../../database/tenant-database.manager.js';
import { UnauthorizedException, NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class MyProfileController extends BaseController {
  constructor(private readonly service: MyProfileService = new MyProfileService()) {
    super();
  }

  private async resolveProfile(req: Request) {
    const reqUser = (req as any).user;
    const userEmail = reqUser?.email?.toLowerCase().trim();
    if (!userEmail) return null;

    const match = await TenantDatabaseManager.findUserAcrossTenants(userEmail);
    if (!match || !match.user) return null;

    const dbUser = match.user;
    const tenantModels = TenantDatabaseManager.getTenantModels(match.dbName);

    let branchDoc: any = null;
    if (dbUser.branchId) {
      try {
        branchDoc = await tenantModels.Branches.findOne({
          $or: [{ _id: dbUser.branchId }, { code: dbUser.branchId }]
        }).lean();
      } catch {}
    }

    const roleNameMap: Record<string, string> = {
      ADMIN: '👑 Gym Administrator (Full Management)',
      SUPER_ADMIN: '🛡️ Root Platform Administrator',
      BRANCH_MANAGER: '🏢 Branch General Manager',
      TRAINER: '🏋️ Fitness Coach & Personal Trainer',
      RECEPTIONIST: '🛎️ Front Desk & Concierge',
      NUTRITIONIST: '🥗 Nutrition & Wellness Specialist',
      ACCOUNTANT: '💳 Finance & Billing Officer',
      MEMBER: '👤 Gym Member Portal',
    };

    return {
      id: dbUser._id.toString(),
      _id: dbUser._id.toString(),
      fullName: dbUser.name || `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim() || 'Staff Member',
      firstName: dbUser.firstName || 'Staff',
      lastName: dbUser.lastName || 'User',
      email: dbUser.email,
      phone: dbUser.phone || '',
      role: dbUser.role,
      securityRole: dbUser.role,
      jobTitle: roleNameMap[dbUser.role] || dbUser.role,
      department: (dbUser as any).department || (dbUser.role === 'TRAINER' ? 'Personal Training & Fitness' : dbUser.role === 'NUTRITIONIST' ? 'Dietetics & Wellness' : dbUser.role === 'ACCOUNTANT' ? 'Finance & Billing' : dbUser.role === 'RECEPTIONIST' ? 'Front Desk & Guest Services' : 'Operations & Facilities'),
      branchId: dbUser.branchId || 'BR-274',
      branchName: branchDoc?.name || (dbUser as any).branchName || 'Main Facility Campus',
      employeeId: dbUser.code || `EMP-${dbUser._id.toString().slice(-4).toUpperCase()}`,
      code: dbUser.code || `EMP-${dbUser._id.toString().slice(-4).toUpperCase()}`,
      avatarUrl: dbUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      coverBannerUrl: (dbUser as any).coverBannerUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
      shiftSchedule: (dbUser as any).shiftSchedule || 'Standard Facility Roster (08:00 - 17:00)',
      emergencyContactName: (dbUser as any).emergencyContactName || 'Family Contact',
      emergencyContactPhone: (dbUser as any).emergencyContactPhone || '+1 (555) 019-2834',
      bio: (dbUser as any).bio || 'Certified fitness and athletic operations specialist at GymFlow ERP.',
      certifications: (dbUser as any).certifications && (dbUser as any).certifications.length > 0 ? (dbUser as any).certifications : ['CPR/AED Certified', 'GymFlow Certified Professional'],
      profileCompletionScore: 100,
      status: typeof dbUser.status === 'string' ? dbUser.status.toUpperCase() : 'ACTIVE',
      permissions: dbUser.permissions || [],
      isActive: dbUser.isActive ?? true,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
    };
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userProfile = await this.resolveProfile(req);
      if (userProfile) {
        return this.ok(res, userProfile, 'User profile retrieved successfully');
      }
      return this.ok(res, null, 'No profile found');
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userProfile = await this.resolveProfile(req);
      if (userProfile) {
        return this.ok(res, userProfile, 'User profile retrieved successfully');
      }
      return this.ok(res, null, 'No profile found');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userProfile = await this.resolveProfile(req);
      return this.ok(res, userProfile, 'Profile retrieved');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqUser = (req as any).user;
      const userEmail = reqUser?.email?.toLowerCase().trim();
      if (!userEmail) {
        throw new UnauthorizedException('Authentication required');
      }

      const match = await TenantDatabaseManager.findUserAcrossTenants(userEmail);
      if (!match || !match.user) {
        throw new NotFoundException('User record not found in database');
      }

      const tenantModels = TenantDatabaseManager.getTenantModels(match.dbName);
      const updateData: any = {};

      if (req.body.fullName) {
        updateData.name = req.body.fullName.trim();
        const parts = updateData.name.split(' ');
        updateData.firstName = parts[0] || match.user.firstName;
        updateData.lastName = parts.slice(1).join(' ') || match.user.lastName;
      }
      if (req.body.firstName) updateData.firstName = req.body.firstName;
      if (req.body.lastName) updateData.lastName = req.body.lastName;
      if (req.body.phone !== undefined) updateData.phone = req.body.phone;
      if (req.body.avatarUrl !== undefined) updateData.avatar = req.body.avatarUrl;
      if (req.body.avatar !== undefined) updateData.avatar = req.body.avatar;
      if (req.body.department !== undefined) updateData.department = req.body.department;
      if (req.body.bio !== undefined) updateData.bio = req.body.bio;
      if (req.body.shiftSchedule !== undefined) updateData.shiftSchedule = req.body.shiftSchedule;
      if (req.body.emergencyContactName !== undefined) updateData.emergencyContactName = req.body.emergencyContactName;
      if (req.body.emergencyContactPhone !== undefined) updateData.emergencyContactPhone = req.body.emergencyContactPhone;
      if (req.body.coverBannerUrl !== undefined) updateData.coverBannerUrl = req.body.coverBannerUrl;
      if (req.body.certifications !== undefined) {
        updateData.certifications = Array.isArray(req.body.certifications)
          ? req.body.certifications
          : String(req.body.certifications).split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      if (req.body.branchId !== undefined) updateData.branchId = req.body.branchId;

      await tenantModels.Users.findByIdAndUpdate(match.user._id, { $set: updateData }, { new: true });

      const updatedProfile = await this.resolveProfile(req);
      return this.ok(res, updatedProfile, 'Profile updated successfully in database');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
