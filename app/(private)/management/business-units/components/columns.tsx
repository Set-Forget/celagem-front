'use client';

import { ColumnDef } from '@tanstack/react-table';
import { BusinessUnitList } from '../schema/business-units';

export const columns: ColumnDef<BusinessUnitList>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => (
      <div>{row.original.name}</div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <div>{row.original.description}</div>,
  },
  {
    accessorKey: 'company_name',
    header: 'Compañía',
    cell: ({ row }) => <div>{row.original.company_name}</div>,
  },
];
