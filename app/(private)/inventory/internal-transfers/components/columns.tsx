'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { InternalTransfers } from '../schema/internal-transfers';

export const internalTransfersColumns: ColumnDef<InternalTransfers>[] = [
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
    accessorKey: 'number',
    header: 'Número',
    cell: ({ row }) => (
      <div className="capitalize flex gap-1">
        <div>{row.original.number}</div>
      </div>
    ),
  },
  {
    accessorKey: 'source_location',
    header: 'Ubicación origen',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.source_location.name}</div>
    ),
  },
  {
    accessorKey: 'destination_location',
    header: 'Ubicación destino',
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.destination_location.name}
      </div>
    ),
  },
  {
    accessorKey: 'scheduled_date',
    header: 'Fecha programada',
    cell: ({ row }) => <div>{row.original.scheduled_date}</div>,
  },
  {
    accessorKey: 'items',
    header: 'Items',
    cell: ({ row }) => <div>{row.original.items.length}</div>,
  },
];
