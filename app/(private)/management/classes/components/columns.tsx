'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ClassList } from '../schema/classes';

export const columns: ColumnDef<ClassList>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => (
      <div>{row.original.name}</div>
    ),
  },
  {
    accessorKey: 'company_name',
    header: 'Compañía',
    cell: ({ row }) => (
      <div>{row.original.company_name}</div>
    ),
  },
];
