'use client';

import { ColumnDef } from '@tanstack/react-table';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { PaymentTerms } from '../schema/payment-terms';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => {
      return <div className="truncate">{row.original.name}</div>;
    },
  },
  {
    accessorKey: 'note',
    header: 'Nota',
    cell: ({ row }) => <div className="truncate">{row.original.note}</div>,
  },
  {
    accessorKey: 'active',
    header: 'Activo',
    cell: ({ row }) => (
      <div className="truncate">{row.original.active ? 'Si' : 'No'}</div>
    ),
  },
];
