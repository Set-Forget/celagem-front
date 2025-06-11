'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useListCompaniesQuery } from '@/lib/services/companies';
import { setDialogsState } from '@/lib/store/dialogs-store';
import { Plus } from 'lucide-react';
import { columns } from './components/columns';
import EditCompanyDialog from './components/edit-company-dialog';
import NewCompanyDialog from './components/new-company-dialog';
import Toolbar from './components/toolbar';
import ViewCompanyDialog from './components/view-company-dialog';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams()

  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }

  const { data: companies, isLoading: isCompaniesLoading } = useListCompaniesQuery();

  const searchName = search.field === "name" ? search?.query : undefined
  const searchDescription = search.field === "description" ? search?.query : undefined

  return (
    <>
      <Header title="Compañias">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => {
            setDialogsState({
              open: 'new-company',
            });
          }}
        >
          <Plus className="w-4 h-4" />
          Crear compañía
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={companies?.data
            ?.filter((company) => {
              if (searchName) {
                return company.name.toLowerCase().includes(searchName.toLowerCase())
              }
              if (searchDescription) {
                return company.description?.toLowerCase().includes(searchDescription.toLowerCase())
              }
              return true
            }) || []
          }
          columns={columns}
          loading={isCompaniesLoading}
          onRowClick={(row) => setDialogsState({ open: 'company-details', payload: { company_id: row.id } })}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
      <NewCompanyDialog />
      <ViewCompanyDialog />
      <EditCompanyDialog />
    </>
  );
}
