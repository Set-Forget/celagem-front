'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CurrencyList } from '../schema/currencies';
import { formatNumber } from '@/lib/utils';

export const columns: ColumnDef<CurrencyList>[] = [
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
    header: 'Unidad por USD',
    cell: ({ row }) => <div className="truncate">{formatNumber(row.original.rate)}</div>,
  },
];
