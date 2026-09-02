import mongoose from 'mongoose';
import { usersSchema, IUsersModel } from '../domains/administration/users/model/users.model.js';
import { gymProfileSchema, IGymProfileModel } from '../domains/gym/gym-profile/model/gym-profile.model.js';
import { branchesSchema, IBranchesModel } from '../domains/gym/branches/model/branches.model.js';
import { membershipPlansSchema, IMembershipPlansModel } from '../domains/members/membership-plans/model/membership-plans.model.js';
import { departmentsSchema, IDepartmentsModel } from '../domains/gym/departments/model/departments.model.js';
import { settingsSchema, ISettingsModel } from '../domains/administration/settings/model/settings.model.js';
import { membersSchema, IMembersModel } from '../domains/members/members/model/members.model.js';
import { staffSchema, IStaffModel } from '../domains/gym/staff/model/staff.model.js';

export interface ITenantModels {
  Users: mongoose.Model<IUsersModel>;
  GymProfile: mongoose.Model<IGymProfileModel>;
  Branches: mongoose.Model<IBranchesModel>;
  MembershipPlans: mongoose.Model<IMembershipPlansModel>;
  Departments: mongoose.Model<IDepartmentsModel>;
  Settings: mongoose.Model<ISettingsModel>;
  Members: mongoose.Model<IMembersModel>;
  Staff: mongoose.Model<IStaffModel>;
  connection: mongoose.Connection;
}

export class TenantDatabaseManager {
  /**
   * Generates dynamic database name derived from gym name and system environment.
   * e.g. "The Next Level Fitness" -> "gymflow_db_the_next_level_fitness"
   */
  static resolveTenantDbName(gymName: string, customSlug?: string): string {
    const raw = customSlug || gymName;
    const cleanSlug = raw
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    const baseName = cleanSlug ? `gymflow_db_${cleanSlug}` : `gymflow_db_${Date.now().toString(36)}`;
    return baseName.slice(0, 60);
  }

  /**
   * Retrieves or initializes the isolated MongoDB database connection for a tenant.
   */
  static getTenantDb(dbNameOrTenantId: string): mongoose.Connection {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      throw new Error('Primary MongoDB connection is not established.');
    }
    const cleanDbName = dbNameOrTenantId.startsWith('tenant_gymflow_')
      ? dbNameOrTenantId.replace(/^tenant_/, '')
      : dbNameOrTenantId;
    return mongoose.connection.useDb(cleanDbName, { useCache: true });
  }

  /**
   * Binds domain schemas to the specific isolated tenant database.
   */
  static getTenantModels(dbName: string): ITenantModels {
    const tenantConnection = this.getTenantDb(dbName);

    const Users = (tenantConnection.models.Users ||
      tenantConnection.model<IUsersModel>('Users', usersSchema)) as mongoose.Model<IUsersModel>;

    const GymProfile = (tenantConnection.models.GymProfile ||
      tenantConnection.model<IGymProfileModel>('GymProfile', gymProfileSchema)) as mongoose.Model<IGymProfileModel>;

    const Branches = (tenantConnection.models.Branches ||
      tenantConnection.model<IBranchesModel>('Branches', branchesSchema)) as mongoose.Model<IBranchesModel>;

    const MembershipPlans = (tenantConnection.models.MembershipPlans ||
      tenantConnection.model<IMembershipPlansModel>('MembershipPlans', membershipPlansSchema)) as mongoose.Model<IMembershipPlansModel>;

    const Departments = (tenantConnection.models.Departments ||
      tenantConnection.model<IDepartmentsModel>('Departments', departmentsSchema)) as mongoose.Model<IDepartmentsModel>;

    const Settings = (tenantConnection.models.Settings ||
      tenantConnection.model<ISettingsModel>('Settings', settingsSchema)) as mongoose.Model<ISettingsModel>;

    const Members = (tenantConnection.models.Members ||
      tenantConnection.model<IMembersModel>('Members', membersSchema)) as mongoose.Model<IMembersModel>;

    const Staff = (tenantConnection.models.Staff ||
      tenantConnection.model<IStaffModel>('Staff', staffSchema)) as mongoose.Model<IStaffModel>;

    return {
      Users,
      GymProfile,
      Branches,
      MembershipPlans,
      Departments,
      Settings,
      Members,
      Staff,
      connection: tenantConnection,
    };
  }

  /**
   * Lists all tenant databases currently active on the MongoDB cluster.
   */
  static async listTenantDatabases(): Promise<string[]> {
    if (!mongoose.connection.db) return [];
    try {
      const adminDb = new (mongoose.mongo as any).Admin(mongoose.connection.db);
      const dbs = await adminDb.listDatabases();
      return dbs.databases
        .map((d: any) => d.name)
        .filter((name: string) => name.startsWith('gymflow_db_') || name.startsWith('gymflow_tenant_'));
    } catch {
      return [];
    }
  }

  /**
   * Finds a user across all tenant databases by email.
   */
  static async findUserAcrossTenants(email: string): Promise<{ user: any; dbName: string } | null> {
    const normalizedEmail = email.toLowerCase().trim();
    const dbs = await this.listTenantDatabases();

    for (const dbName of dbs) {
      try {
        const models = this.getTenantModels(dbName);
        const user = await models.Users.findOne({ email: normalizedEmail, isDeleted: false }).exec();
        if (user) {
          return { user, dbName };
        }
      } catch {}
    }
    return null;
  }
}
