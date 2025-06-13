'use client';

import { ColumnDef } from '@tanstack/react-table';
import { TaxesList } from '../schema/taxes';
import { taxKinds } from '../utils';

export const columns: ColumnDef<TaxesList>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => {
      return <div className="truncate">{row.original.name}</div>;
    },
  },
  {
    accessorKey: 'amount',
    header: 'Porcentaje',
    cell: ({ row }) => <div className="truncate">{row.original.amount}%</div>,
  },
  {
    accessorKey: 'tax_kind',
    header: 'Tipo',
    cell: ({ row }) => <div className="truncate">{taxKinds[row.original.tax_kind] || "No especificado"}</div>,
  },
];
