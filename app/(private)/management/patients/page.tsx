'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { patientsColumns, usersColumns } from './components/columns';
import Toolbar from './components/toolbar';
import { useLazyListUsersQuery } from '@/lib/services/users';

export default function PatientsPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [listPatients, { data, isLoading }] = useLazyListUsersQuery();

  const patients = data?.data;

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!patients) {
    return <div>No hay pacientes</div>;
  }

  return (
    <>
      <Header title="Pacientes">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear paciente
        </Button>
      </Header>

      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={patients}
          columns={patientsColumns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  );
}
