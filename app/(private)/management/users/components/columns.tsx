'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { UserList } from '@/lib/schemas/users'; 

export const usersColumns: ColumnDef<Partial<UserList>>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 10,
  },
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
    accessorKey: 'is_email_confirmed',
    header: 'Email confirmado',
    cell: ({ row }) => (
      <div>{row.original.is_email_confirmed ? 'Si' : 'No'}</div>
    ),
  },
];
