'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { rolesColumns } from './components/columns';
import Toolbar from './components/toolbar';
import { useListRolesQuery } from '@/lib/services/roles';

export default function RolesPage() {
  const pathname = usePathname();
  const router = useRouter();

  const { data, isLoading } = useListRolesQuery();

  const roles = data?.data;

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!roles) {
    return <div>No se encontraron roles</div>;
  }

  return (
    <>
      <Header title="Roles">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear rol
        </Button>
      </Header>

      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={roles}
          columns={rolesColumns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  );
}
