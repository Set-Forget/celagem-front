'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PatientDetail } from '@/app/(private)/medical-management/patients/schema/patients';
import { Checkbox } from '@/components/ui/checkbox';

export const columnsPatients: ColumnDef<Partial<PatientDetail>>[] = [
  {
    accessorKey: 'first_name',
    header: 'Nombre',
    cell: ({ row }) => <div>{row.getValue('first_name')}</div>,
    size: 100,
  },
  {
    accessorKey: 'last_name',
    header: 'Apellido',
    cell: ({ row }) => {
      return <div>{row.getValue('last_name')}</div>;
    },
  },
];
