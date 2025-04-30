'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductList } from '../schema/products';

export const productsColumns: ColumnDef<ProductList>[] = [
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
        <div>{row.original.default_code}</div>
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: 'template',
    header: 'Plantilla',
    cell: ({ row }) => <div>{row.original.template.name}</div>,
  },
  {
    accessorKey: 'standard_price',
    header: 'Precio estándar',
    cell: ({ row }) => <div>{row.original.standard_price}</div>,
  },
  {
    accessorKey: 'uom',
    header: 'Unidad de medida',
    cell: ({ row }) => <div>{row.original.uom}</div>,
  },
  {
    accessorKey: 'active',
    header: 'Activo',
    cell: ({ row }) => <div>{row.original.active ? 'Sí' : 'No'}</div>,
  },
];
