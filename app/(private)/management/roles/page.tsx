'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useListRolesQuery } from '@/lib/services/roles';
import { setDialogsState } from '@/lib/store/dialogs-store';
import { Plus } from 'lucide-react';
import { rolesColumns } from './components/columns';
import NewRole from './components/new-role-dialog';
import Toolbar from './components/toolbar';
import ViewRoleDialog from './components/view-role-dialog';
import EditRoleDialog from './components/edit-role-dialog';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams()

  const { data: roles, isLoading } = useListRolesQuery({ company_id: '' });

  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }

  const searchName = search.field === "name" ? search?.query : undefined
  const searchCompany = search.field === "company_name" ? search?.query : undefined

  return (
    <div>
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
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={roles?.data
            ?.filter((role) => {
              if (searchName) {
                return role.name.toLowerCase().includes(searchName?.toLowerCase() || '')
              }
              if (searchCompany) {
                return role.company_name?.toLowerCase().includes(searchCompany?.toLowerCase() || '')
              }
              return true
            })
            || []}
          columns={rolesColumns}
          loading={isLoading}
          onRowClick={(row) => setDialogsState({ open: 'role-details', payload: { role_id: row.id } })}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
      <NewRole />
      <ViewRoleDialog />
      <EditRoleDialog />
    </div>
  );
}
