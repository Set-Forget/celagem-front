'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Materials } from '@/app/(private)/register/materials/schema/materials';

export const columnsMaterials: ColumnDef<Materials>[] = [
  {
    accessorKey: 'code',
    header: 'Código',
    cell: ({ row }) => <div>{row.getValue('code')}</div>,
    size: 100,
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => {
      return <div>{row.getValue('name')}</div>;
    },
  },
  {
    accessorKey: 'unit',
    header: 'Unidad',
    cell: ({ row }) => <div>{row.getValue('unit')}</div>,
  },
  {
    accessorKey: 'fraction',
    header: 'Fracción',
    cell: ({ row }) => <div>{row.getValue('fraction')}</div>,
  },
  {
    accessorKey: 'average_price',
    header: 'Precio promedio',
    cell: ({ row }) => <div>{row.getValue('average_price')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: () => {
      return <></>;
    },
  },
];
