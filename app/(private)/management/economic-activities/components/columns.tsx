'use client';

import { EconomicActivityList } from '../schema/economic-activities';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Partial<EconomicActivityList>>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => (
      <div>{row.original.name}</div>
    ),
  },
  {
    accessorKey: 'code',
    header: 'Código',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.code}</div>
    ),
  },
];
