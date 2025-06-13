'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PaymentTermList } from '../schema/payment-terms';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const columns: ColumnDef<PaymentTermList>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => {
      return <div className="truncate">{row.original.name}</div>;
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Fecha de creación',
    cell: ({ row }) => (
      <div className="truncate">{row.original.created_at ? format(row.original.created_at, 'PP', { locale: es }) : 'No especificado'}</div>
    ),
  },
];
