'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRight } from 'lucide-react';
import { DeliveryNoteList } from '../schemas/delivery-notes';
import { deliveryNoteStatus } from '../utils';

export const columns: ColumnDef<DeliveryNoteList>[] = [
  {
    accessorKey: 'sequence_id',
    header: 'Número',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('sequence_id')}</div>
    ),
  },
  {
    accessorKey: 'customer',
    header: 'Cliente',
    cell: ({ row }) => <div>{row.getValue('customer')}</div>,
  },
  {
    accessorKey: "state",
    header: "Estado",
    cell: ({ row }) => {
      const status = deliveryNoteStatus[row.getValue("state") as keyof typeof deliveryNoteStatus]
      return <Badge
        variant="custom"
        className={cn(`${status?.bg_color} ${status?.text_color} border-none`)}
      >
        {status?.label}
      </Badge>
    },
  },
  {
    accessorKey: 'delivery_date',
    header: 'Fecha de entrega',
    cell: ({ row }) => (
      <div>
        {format(parseISO(row.getValue('delivery_date')), 'PP', { locale: es })}
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
