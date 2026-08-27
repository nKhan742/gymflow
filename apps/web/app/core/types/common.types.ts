export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export interface IBaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type StatusType = 'active' | 'inactive' | 'pending' | 'suspended' | 'archived';
export type ThemeModeType = 'light' | 'dark' | 'system';
