'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Materials } from '../schema/medical-exam';

export const columnsMaterials: ColumnDef<Materials>[] = [
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
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    size: 200,
  },
  {
    accessorKey: 'category',
    header: 'Categoría',
    cell: ({ row }) => <div>{row.original.qty_required}</div>,
    size: 150,
  },
];
