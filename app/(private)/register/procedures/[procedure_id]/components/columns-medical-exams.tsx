'use client';

import { ColumnDef } from '@tanstack/react-table';

export const columnsMedicalExams: ColumnDef<any>[] = [
  {
    accessorKey: 'code',
    header: 'Código',
    cell: ({ row }) => <div>{row.getValue('code')}</div>,
    size: 100,
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
    cell: ({ row }) => <div>{row.getValue('description')}</div>,
  },
  {
    accessorKey: 'unit',
    header: 'Unidad',
    cell: ({ row }) => {
      return <div>{row.getValue('unit')}</div>;
    },
  },
  {
    accessorKey: 'total_cost',
    header: 'Costo total',
    cell: ({ row }) => {
      return <div>{row.getValue('total_cost')}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: () => {
      return <></>;
    },
  },
];
