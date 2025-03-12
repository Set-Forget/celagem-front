'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { MaterialsInventoryEntry } from '../schema/materials-inventory-entry';

export const materialsInventoryEntriesColumns: ColumnDef<MaterialsInventoryEntry>[] =
  [
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
      accessorKey: 'brand',
      header: 'Marca',
      cell: ({ row }) => <div>{row.original.brand ?? 'Generico'}</div>,
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: 'lot_number',
      header: 'Número de lote',
      cell: ({ row }) => <div>{row.original.lot_number}</div>,
    },
    {
      accessorKey: 'purchase_unit',
      header: 'Unidad de compra',
      cell: ({ row }) => <div>{row.original.purchase_unit}</div>,
    },
    {
      accessorKey: 'convertion_rate_purchase_to_cost_unit',
      header: 'Tasa de conversión',
      cell: ({ row }) => <div>{row.original.convertion_rate_purchase_to_cost_unit}</div>,
    },
    {
      accessorKey: 'cost_unit',
      header: 'Unidad de costo',
      cell: ({ row }) => <div>{row.original.cost_unit}</div>,
    },
    {
      accessorKey: 'cost_unit_price',
      header: 'Precio unitario',
      cell: ({ row }) => <div>{row.original.cost_unit_price}</div>,
    },
    {
      accessorKey: 'qty',
      header: 'Cantidad',
      cell: ({ row }) => <div>{row.original.qty}</div>,
    },
    {
      // accessorKey: 'qty',
      header: 'Inventario valuado',
      cell: ({ row }) => <div>${(row.original?.qty * row.original?.cost_unit_price).toFixed(2)}</div>,
    },
  ];
