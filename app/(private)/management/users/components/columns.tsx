'use client';

import { AdaptedUserList } from '@/lib/adapters/users';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<AdaptedUserList>[] = [
  {
    accessorKey: 'first_name',
    header: 'Nombre',
    cell: ({ row }) => (
      <div className="capitalize flex gap-1">
        <div>{row.original.first_name}</div>
      </div>
    ),
  },
  {
    accessorKey: 'last_name',
    header: 'Apellido',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.last_name}</div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div>{row.original.email}</div>,
  },
  {
    accessorKey: 'role.name',
    header: 'Rol',
    cell: ({ row }) => (
      <div>{row.original.role.name}</div>
    ),
  },
];
