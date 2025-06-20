'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CompanyList } from '../schema/companies';

export const columns: ColumnDef<CompanyList>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => (
      <div className="flex gap-1">
        <div>{row.original.name}</div>
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.description}</div>
    ),
  },
];
