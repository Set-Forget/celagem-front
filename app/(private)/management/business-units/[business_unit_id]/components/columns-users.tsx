'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Users } from '../../../users/schema/users';

export const columnsUsers: ColumnDef<Partial<Users>>[] = [
  {
    accessorKey: 'email',
    header: 'Correo',
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
    size: 100,
  },
];
