'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { MedicalExam } from '../schema/medical-exam';

export const columns: ColumnDef<MedicalExam>[] = [
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
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => <div className="font-medium">{row.original.status}</div>,
    size: 200,
  },
  {
    accessorKey: 'cup_code',
    header: 'CUP',
    cell: ({ row }) => <div>{row.original.cup_code}</div>,
    size: 150,
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
    cell: ({ row }) => <div>{row.original.description}</div>,
    minSize: 300,
  },
  {
    accessorKey: 'cost',
    header: 'Costo',
    cell: ({ row }) => <div>{row.original.cost}</div>,
    size: 100,
  },
  {
    accessorKey: 'cost',
    header: 'Valor',
    cell: ({ row }) => <div>{row.original.cost}</div>,
    size: 100,
  },
  {
    accessorKey: 'unit_cost',
    header: 'Costo Unitario',
    cell: ({ row }) => <div>{row.original.unit_cost}</div>,
    size: 100,
  },
];
