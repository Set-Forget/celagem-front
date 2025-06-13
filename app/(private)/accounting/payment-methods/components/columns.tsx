'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PaymentMethodList } from '../schema/payment-methods';
import { paymentTypes } from '../utils';

export const columns: ColumnDef<PaymentMethodList>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => {
      return <div className="truncate">{row.original.name}</div>;
    },
  },
  {
    accessorKey: 'payment_type',
    header: 'Tipo de pago',
    cell: ({ row }) => {
      return <div className="truncate">{paymentTypes[row.original.payment_type]}</div>;
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
