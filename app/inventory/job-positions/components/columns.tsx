'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { JobPosition } from '../schema/job-position';

export const columns: ColumnDef<JobPosition>[] = [
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
  },
  {
    accessorKey: 'code',
    header: 'Código',
    cell: ({ row }) => (
      <div className="capitalize flex gap-1">
        <div>{row.original.code}</div>
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: 'total_cost',
    header: 'Costo total',
    cell: ({ row }) => <div className="font-medium">{row.original.total_cost}</div>,
    size: 200,
  },
  {
    accessorKey: 'unit_cost',
    header: 'Costo unitario',
    cell: ({ row }) => <div>{row.original.unit_cost}</div>,
    size: 150,
  },
  {
    accessorKey: 'unit',
    header: 'Unidad',
    cell: ({ row }) => (
      <div>
        {row.original.unit}
      </div>
    ),
    minSize: 300,
  },
];
