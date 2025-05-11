'use client';

import { ColumnDef } from '@tanstack/react-table';

import { format } from 'date-fns';
import { DeliveryNoteList } from '../schemas/delivery-notes';
import { es } from 'date-fns/locale';
import { ArrowRight } from 'lucide-react';

export const columns: ColumnDef<DeliveryNoteList>[] = [
  {
    accessorKey: 'number',
    header: 'Número',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('number')}</div>
    ),
  },
  {
    accessorKey: 'customer',
    header: 'Cliente',
    cell: ({ row }) => <div>{row.getValue('customer')}</div>,
  },
  {
    accessorKey: 'scheduled_date',
    header: 'Fecha de entrega',
    cell: ({ row }) => (
      <div>
        {format(new Date(row.getValue('scheduled_date')), 'PP', { locale: es })}
      </div>
    ),
  },
  {
    accessorKey: 'delivery_location',
    header: 'Movimiento',
    cell: ({ row }) => (
      <div className="text-sm flex items-center gap-1">
        {row.original.source_location}{' '}
        <ArrowRight size={14} />{' '}
        {row.original.delivery_location}
      </div>
    ),
  }
];
