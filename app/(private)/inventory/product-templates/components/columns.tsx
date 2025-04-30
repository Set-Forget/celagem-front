'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductTemplates } from '../schema/products-templates';

export const productTemplatesColumns: ColumnDef<ProductTemplates>[] = [
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
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 10,
  },
  {
    accessorKey: 'code',

    cell: ({ row }) => <div className="w-[80px]">{row.getValue('code')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'name',

    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'purchase_unit',

    cell: ({ row }) => <div>{row.original.purchase_unit.name}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'average_price',

    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('average_price'));
      const formatted = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP', // Assuming CLP, adjust if needed
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
    enableSorting: true,
    enableHiding: true,
  },
];
