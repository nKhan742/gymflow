import mongoose from 'mongoose';
import { usersSchema, IUsersModel } from '../domains/administration/users/model/users.model.js';
import { gymProfileSchema, IGymProfileModel } from '../domains/gym/gym-profile/model/gym-profile.model.js';
import { branchesSchema, IBranchesModel } from '../domains/gym/branches/model/branches.model.js';
import { membershipPlansSchema, IMembershipPlansModel } from '../domains/members/membership-plans/model/membership-plans.model.js';
import { departmentsSchema, IDepartmentsModel } from '../domains/gym/departments/model/departments.model.js';
import { settingsSchema, ISettingsModel } from '../domains/administration/settings/model/settings.model.js';
import { membersSchema, IMembersModel } from '../domains/members/members/model/members.model.js';
import { staffSchema, IStaffModel } from '../domains/gym/staff/model/staff.model.js';
import { rolesSchema, IRolesModel } from '../domains/administration/roles/model/roles.model.js';
import { shiftManagementSchema, IShiftManagementModel } from '../domains/gym/shift-management/model/shift-management.model.js';
import { holidaysSchema, IHolidaysModel } from '../domains/gym/holidays/model/holidays.model.js';
import { exerciseCategoriesSchema, IExerciseCategoriesModel } from '../domains/fitness/exercise-categories/model/exercise-categories.model.js';
import { workoutTemplatesSchema, IWorkoutTemplatesModel } from '../domains/fitness/workout-templates/model/workout-templates.model.js';
import { mealLibrarySchema, IMealLibraryModel } from '../domains/nutrition/meal-library/model/meal-library.model.js';
import { dietPlansSchema, IDietPlansModel } from '../domains/nutrition/diet-plans/model/diet-plans.model.js';
import { permissionsSchema, IPermissionsModel } from '../domains/administration/permissions/model/permissions.model.js';

export interface ITenantModels {
  Users: mongoose.Model<IUsersModel>;
  GymProfile: mongoose.Model<IGymProfileModel>;
  Branches: mongoose.Model<IBranchesModel>;
  MembershipPlans: mongoose.Model<IMembershipPlansModel>;
  Departments: mongoose.Model<IDepartmentsModel>;
  Settings: mongoose.Model<ISettingsModel>;
  Members: mongoose.Model<IMembersModel>;
  Staff: mongoose.Model<IStaffModel>;
  Roles: mongoose.Model<IRolesModel>;
  Permissions: mongoose.Model<IPermissionsModel>;
  Shifts: mongoose.Model<IShiftManagementModel>;
  Holidays: mongoose.Model<IHolidaysModel>;
  ExerciseCategories: mongoose.Model<IExerciseCategoriesModel>;
  WorkoutTemplates: mongoose.Model<IWorkoutTemplatesModel>;
  MealLibrary: mongoose.Model<IMealLibraryModel>;
  DietPlans: mongoose.Model<IDietPlansModel>;
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

    const Roles = (tenantConnection.models.Roles ||
      tenantConnection.model<IRolesModel>('Roles', rolesSchema)) as mongoose.Model<IRolesModel>;

    const Permissions = (tenantConnection.models.Permissions ||
      tenantConnection.model<IPermissionsModel>('Permissions', permissionsSchema)) as mongoose.Model<IPermissionsModel>;

    const Shifts = (tenantConnection.models.Shifts ||
      tenantConnection.model<IShiftManagementModel>('Shifts', shiftManagementSchema)) as mongoose.Model<IShiftManagementModel>;

    const Holidays = (tenantConnection.models.Holidays ||
      tenantConnection.model<IHolidaysModel>('Holidays', holidaysSchema)) as mongoose.Model<IHolidaysModel>;

    const ExerciseCategories = (tenantConnection.models.ExerciseCategories ||
      tenantConnection.model<IExerciseCategoriesModel>('ExerciseCategories', exerciseCategoriesSchema)) as mongoose.Model<IExerciseCategoriesModel>;

    const WorkoutTemplates = (tenantConnection.models.WorkoutTemplates ||
      tenantConnection.model<IWorkoutTemplatesModel>('WorkoutTemplates', workoutTemplatesSchema)) as mongoose.Model<IWorkoutTemplatesModel>;

    const MealLibrary = (tenantConnection.models.MealLibrary ||
      tenantConnection.model<IMealLibraryModel>('MealLibrary', mealLibrarySchema)) as mongoose.Model<IMealLibraryModel>;

    const DietPlans = (tenantConnection.models.DietPlans ||
      tenantConnection.model<IDietPlansModel>('DietPlans', dietPlansSchema)) as mongoose.Model<IDietPlansModel>;

    return {
      Users,
      GymProfile,
      Branches,
      MembershipPlans,
      Departments,
      Settings,
      Members,
      Staff,
      Roles,
      Permissions,
      Shifts,
      Holidays,
      ExerciseCategories,
      WorkoutTemplates,
      MealLibrary,
      DietPlans,
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

    // 1. Fast check in primary database first (sub-millisecond)
    try {
      const defaultModels = this.getTenantModels('gymflow_erp');
      const primaryUser = await defaultModels.Users.findOne({ email: normalizedEmail, isDeleted: false }).exec();
      if (primaryUser && primaryUser.tenantId) {
        const dbName = primaryUser.tenantId.replace(/^tenant_/, '');
        const tenantModels = this.getTenantModels(dbName);
        const tenantUser = await tenantModels.Users.findOne({ email: normalizedEmail, isDeleted: false }).exec();
        if (tenantUser) {
          return { user: tenantUser, dbName };
        }
        return { user: primaryUser, dbName };
      }
    } catch {}

    // 2. Fallback: inspect discovered tenant databases
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
