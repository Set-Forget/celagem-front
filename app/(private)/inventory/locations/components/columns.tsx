'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Locations } from '../schema/locations';

export const locationsColumns: ColumnDef<Locations>[] = [
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
  // {
  //   accessorKey: 'name',
  //   header: 'Nombre',
  //   cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  // },
  // {
  //   accessorKey: 'company',
  //   header: 'Sede',
  //   cell: ({ row }) => <div>{row.original.company}</div>,
  // },
  {
    accessorKey: 'complete_name',
    header: 'Nombre completo',
    cell: ({ row }) => <div className="font-medium">{row.original.complete_name}</div>,
  },
  {
    accessorKey: 'active',
    header: 'Estado',
    cell: ({ row }) => <div>{row.original.active ? 'Activo' : 'Inactivo'}</div>,
  },
  {
    accessorKey: 'has_products',
    header: 'Tiene productos',
    cell: ({ row }) => <div>{row.original.has_products ? 'Si' : 'No'}</div>,
  },
];
