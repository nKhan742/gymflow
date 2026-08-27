export class PermissionRegistry {
  private static permissions = new Set<string>();

  static register(permission: string | string[]): void {
    if (Array.isArray(permission)) {
      permission.forEach((p) => this.permissions.add(p));
    } else {
      this.permissions.add(permission);
    }
  }

  static getAll(): string[] {
    return Array.from(this.permissions);
  }

  static has(permission: string): boolean {
    return this.permissions.has(permission);
  }
}
