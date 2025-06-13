'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PaymentMethodLineList } from '../schema/payment-methods';

export const columns: ColumnDef<PaymentMethodLineList>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => {
      return <div className="truncate">{row.original.payment_method}</div>;
    },
  },
  {
    accessorKey: 'payment_account',
    header: 'Cuenta contable',
    cell: ({ row }) => {
      return <div className="truncate">{row.original.payment_account}</div>;
    },
  },
  {
    accessorKey: 'company',
    header: 'Compañía',
    cell: ({ row }) => {
      return <div className="truncate">{row.original.company}</div>;
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
