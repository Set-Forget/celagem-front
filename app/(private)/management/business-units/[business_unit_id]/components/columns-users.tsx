'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Users } from '../../../users/schema/users';
import { Trash } from 'lucide-react';
import { setDialogsState } from '@/lib/store/dialogs-store';

export const columnsUsers: ColumnDef<Partial<Users>>[] = [
  {
    accessorKey: 'email',
    header: 'Correo',
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
    size: 100,
  },
  
];
