'use client';

import { ColumnDef } from '@tanstack/react-table';
import { JobPosition } from '@/app/(private)/register/job-positions/schema/job-position';

export const columnsJobPositions: ColumnDef<JobPosition>[] = [
  {
    accessorKey: 'code',
    header: 'Código',
    cell: ({ row }) => <div>{row.getValue('code')}</div>,
    size: 100,
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
    accessorKey: 'unit_cost',
    header: 'Costo unidad',
    cell: ({ row }) => <div>{row.getValue('unit_cost')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: () => {
      return <></>;
    },
  },
];
