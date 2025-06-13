'use client';

import { ColumnDef } from '@tanstack/react-table';
import { UserList } from '../schema/users';

export const columns: ColumnDef<UserList>[] = [
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
    accessorKey: 'role_name',
    header: 'Rol',
    cell: ({ row }) => (
      <div>{row.original.role_name}</div>
    ),
  },
];
