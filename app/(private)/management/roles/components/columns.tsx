'use client';

import { ColumnDef } from '@tanstack/react-table';
import { RoleList } from '../schema/roles';

export const rolesColumns: ColumnDef<RoleList>[] = [
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
