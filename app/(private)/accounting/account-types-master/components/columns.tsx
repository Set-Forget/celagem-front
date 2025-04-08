'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ACCOUNTING_REPORT_STATUSES } from '../adapter/statuses';
import { AccountType } from '../schemas/account-types';

export const columns: ColumnDef<AccountType>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre de cuenta',
    cell: ({ row }) => (
      <div className="capitalize flex gap-1">
        <div className="font-medium">{row.getValue('name')}</div>
      </div>
    ),
  },
  {
    accessorKey: 'report',
    header: 'Reporte',
    cell: ({ row }) => {
      return (
        <div className="flex gap-1">
          <div className="font-medium">{row.getValue('report')}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Categoria',
    cell: ({ row }) => (
      <div className="flex gap-1">
        <div className="font-medium">{row.getValue('category')}</div>
      </div>
    ),
  },
];
