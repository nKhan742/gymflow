import React from 'react';

export interface ITableColumn<T = unknown> {
  id: string;
  header: string;
  accessorKey?: keyof T | string;
  cell?: (info: { row: { original: T }; getValue: () => unknown }) => React.ReactNode;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
}

export interface ITableFilter {
  field: string;
  value: unknown;
  operator?: 'equals' | 'contains' | 'startsWith' | 'between' | 'in';
}
