'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { MedicalExams } from '../schema/medical-exams';

export const medicalExamsColumns: ColumnDef<MedicalExams>[] = [
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
    accessorKey: 'code',
    header: 'Código',
    cell: ({ row }) => (
      <div className="capitalize flex gap-1">
        <div>{row.original.code}</div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => <div className="font-medium">{row.original.status}</div>,
  },
  {
    accessorKey: 'cups_code',
    header: 'CUPS',
    cell: ({ row }) => <div>{row.original.cups_code}</div>,
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
    cell: ({ row }) => <div>{row.original.description}</div>,
  },
  {
    accessorKey: 'cost',
    header: 'Costo',
    cell: ({ row }) => <div>{row.original.cost}</div>,
  },
  {
    accessorKey: 'cost',
    header: 'Valor',
    cell: ({ row }) => <div>{row.original.cost}</div>,
  },
  {
    accessorKey: 'unit_cost',
    header: 'Costo Unitario',
    cell: ({ row }) => <div>{row.original.unit_cost}</div>,
  },
];
