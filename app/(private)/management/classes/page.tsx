'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import {
  useListClassesQuery
} from '@/lib/services/classes';
import { setDialogsState } from '@/lib/store/dialogs-store';
import { Plus } from 'lucide-react';
import { columns } from './components/columns';
import NewClassDialog from './components/new-class-dialog';
import Toolbar from './components/toolbar';
import ViewClassDialog from './components/view-class-dialog';
import EditClassDialog from './components/edit-class-dialog';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams()

  const { data: classes, isLoading: isLoadingClasses } = useListClassesQuery();

  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }

  const searchName = search.field === "name" ? search?.query : undefined
  const searchCompany = search.field === "company_name" ? search?.query : undefined

  return (
    <div>
      <Header title="Clases">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => {
            setDialogsState({
              open: 'new-class',
            });
          }}
        >
          <Plus className="w-4 h-4" />
          Crear clase
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={classes?.data
            .filter((c) => {
              if (searchName) {
                return c.name.toLowerCase().includes(searchName.toLowerCase())
              }
              if (searchCompany) {
                return c.company_name.toLowerCase().includes(searchCompany.toLowerCase())
              }
              return true
            }) || []}
          columns={columns}
          loading={isLoadingClasses}
          onRowClick={(row) => setDialogsState({ open: 'class-details', payload: { class_id: row.id } })}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
      <NewClassDialog />
      <EditClassDialog />
      <ViewClassDialog />
    </div>
  );
}
