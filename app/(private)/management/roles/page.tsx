'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { rolesColumns } from './components/columns';
import Toolbar from './components/toolbar';
import { useLazyListRolesQuery, useListRolesQuery } from '@/lib/services/roles';
import { setDialogsState } from '@/lib/store/dialogs-store';
import NewRole from './components/new-role';

export default function RolesPage() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: roles, isLoading } = useListRolesQuery();

  return (
    <>
      <Header title="Roles">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => {
            setDialogsState({
              open: 'new-role',
            });
          }}
        >
          <Plus className="w-4 h-4" />
          Crear rol
        </Button>
      </Header>

      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={roles?.data || []}
          columns={rolesColumns}
          loading={isLoading}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
      <NewRole />
    </>
  );
}
