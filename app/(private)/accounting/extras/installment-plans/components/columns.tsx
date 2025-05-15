'use client';

import { ColumnDef } from '@tanstack/react-table';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Taxes } from '../schema/installment-plans';

export const columns: ColumnDef<Taxes>[] = [
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
    cell: ({ row }) => <div className="truncate">{row.original.amount}</div>,
  },
  {
    accessorKey: 'tax_group',
    header: 'Grupo',
    cell: ({ row }) => <div className="truncate">{row.original.tax_group}</div>,
  },

  {
    accessorKey: 'active',
    header: 'Activo',
    cell: ({ row }) => (
      <div className="truncate">{row.original.active ? 'Si' : 'No'}</div>
    ),
  },
];
