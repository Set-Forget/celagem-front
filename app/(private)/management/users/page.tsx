'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { usersColumns } from './components/columns';
import Toolbar from './components/toolbar';
import { useListUsersQuery } from '@/lib/services/users';

export default function UsersPage() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: users, isLoading } = useListUsersQuery();

  return (
    <>
      <Header title="Usuarios">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4" />
          Crear usuario
        </Button>
      </Header>

      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={users?.data || []}
          columns={usersColumns}
          loading={isLoading}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  );
}
