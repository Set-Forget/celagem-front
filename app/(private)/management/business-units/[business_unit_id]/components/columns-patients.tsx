'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PatientDetail } from '@/app/(private)/medical-management/patients/schema/patients';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash } from 'lucide-react';
import { setDialogsState } from '@/lib/store/dialogs-store';

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
  {
    id: 'actions',
    cell: ({ row }: { row: any }) => (
      <Trash
        className="-ms-0.5 me-1.5 cursor-pointer hover:text-red-500"
        size={20}
        aria-hidden="true"
        onClick={() => () => console.log('delete patient') 
          // setDialogsState({
          //   open: 'delete-patient-business-unit',
          //   payload: {
          //     id: row.original.id,
          //   },
          // });
        }
      />
    ),
  },
];
