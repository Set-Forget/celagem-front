'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useListUsersQuery } from '@/lib/services/users';
import { setDialogsState } from '@/lib/store/dialogs-store';
import { Plus } from 'lucide-react';
import { columns } from './components/columns';
import EditUserDialog from './components/edit-user-dialog';
import NewUserDialog from './components/new-user-dialog';
import Toolbar from './components/toolbar';
import UserDetailsDialog from './components/view-user-dialog';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams()

  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }

  const { data: users, isLoading: isUsersLoading } = useListUsersQuery();

  const searchName = search.field === "name" ? search?.query : undefined
  const searchEmail = search.field === "email" ? search?.query : undefined

  return (
    <div>
      <Header title="Usuarios">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => setDialogsState({ open: 'new-user' })}
          disabled={isUsersLoading}
        >
          <Plus className="w-4 h-4" />
          Crear usuario
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={users
            ?.filter((user) => {
              if (searchName) {
                const fullName = `${user.first_name} ${user.last_name}`
                return fullName.toLowerCase().includes(searchName?.toLowerCase() || '')
              }
              if (searchEmail) {
                return user.email.toLowerCase().includes(searchEmail?.toLowerCase() || '')
              }
              return true
            })
            || []}
          columns={columns}
          loading={isUsersLoading}
          onRowClick={(row) => setDialogsState({ open: 'user-details', payload: { user_id: row.id } })}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
      <NewUserDialog />
      <UserDetailsDialog />
      <EditUserDialog />
    </div>
  );
}
