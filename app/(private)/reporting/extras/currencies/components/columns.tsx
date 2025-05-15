'use client';

import { ColumnDef } from '@tanstack/react-table';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Currencies } from '../schema/currencies';

export const columns: ColumnDef<Currencies>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => {
      return <div className="truncate">{row.original.name}</div>;
    },
  },
  {
    accessorKey: 'symbol',
    header: 'Símbolo',
    cell: ({ row }) => <div className="truncate">{row.original.symbol}</div>,
  },
  {
    accessorKey: 'rate',
    header: 'Tasa',
    cell: ({ row }) => <div className="truncate">{row.original.rate}</div>,
  },

  {
    accessorKey: 'active',
    header: 'Activo',
    cell: ({ row }) => (
      <div className="truncate">{row.original.active ? 'Si' : 'No'}</div>
    ),
  },
];
