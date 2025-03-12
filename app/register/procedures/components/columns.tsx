'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ProcedureReceipt } from '../schema/procedure';

export const proceduresColumns: ColumnDef<ProcedureReceipt>[] = [
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
    accessorKey: 'schema',
    header: 'Esquema',
    cell: ({ row }) => (
      <div className="capitalize flex gap-1">
        <div>{row.original.schema}</div>
      </div>
    ),
  },
  {
    accessorKey: 'cups_code',
    header: 'CUPS',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.cups_code}</div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
    cell: ({ row }) => <div>{row.original.description}</div>,
  },
];
