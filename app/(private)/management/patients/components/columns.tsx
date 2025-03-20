'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Patients } from '../schema/patients';

export const patientsColumns: ColumnDef<Patients>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 10,
  },
  {
    accessorKey: 'first_name',
    header: 'Nombre',
    cell: ({ row }) => (
      <div className="capitalize flex gap-1">
        <div>{row.original.first_name}</div>
      </div>
    ),
  },
  {
    accessorKey: 'last_name',
    header: 'Apellido',
    cell: ({ row }) => <div className="font-medium">{row.original.last_name}</div>,
  },
  {
    accessorKey: 'birthdate',
    header: 'Fecha de nacimiento',
    cell: ({ row }) => <div>{row.original.birthdate.toString()}</div>,
  },
  {
    accessorKey: 'sex',
    header: 'Sexo',
    cell: ({ row }) => <div>{row.original.sex}</div>,
  },
  {
    accessorKey: 'email',
    header: 'Email', 
    cell: ({ row }) => <div>{row.original.email}</div>,
  },
  {
    accessorKey: 'phone_number',
    header: 'Teléfono',
    cell: ({ row }) => <div>{row.original.phone_number}</div>,
  },

];
