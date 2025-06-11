'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { columns } from './components/columns';
import { useListBusinessUnitsQuery } from '@/lib/services/business-units';
import Toolbar from './components/toolbar';
import { setDialogsState } from '@/lib/store/dialogs-store';
import NewBusinessUnitDialog from './components/new-business-unit-dialog';
import EditBusinessUnitDialog from './components/edit-business-unit-dialog';
import ViewBusinessUnitDialog from './components/view-business-unit-dialog';
import { useSearchParams } from 'next/navigation';

export default function BusinessUnitsPage() {
  const searchParams = useSearchParams()

  const { data: businessUnits, isLoading: isBusinessUnitsLoading } = useListBusinessUnitsQuery();

  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }

  const searchName = search.field === "name" ? search?.query : undefined
  const searchCompany = search.field === "company_name" ? search?.query : undefined

  return (
    <div>
      <Header title="Unidades de negocio">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => {
            setDialogsState({
              open: 'new-business-unit'
            });
          }}
        >
          <Plus className="w-4 h-4" />
          Crear unidad de negocio
        </Button>
      </Header>

      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={businessUnits?.data
            .filter((businessUnit) => {
              if (searchName) {
                return businessUnit.name.toLowerCase().includes(searchName.toLowerCase())
              }
              if (searchCompany) {
                return businessUnit.company_name.toLowerCase().includes(searchCompany.toLowerCase())
              }
              return true
            }) || []}
          loading={isBusinessUnitsLoading}
          columns={columns}
          onRowClick={(row) => {
            setDialogsState({
              open: 'business-unit-details',
              payload: { business_unit_id: row.id }
            });
          }}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>

      {/* Dialogs */}
      <NewBusinessUnitDialog />
      <EditBusinessUnitDialog />
      <ViewBusinessUnitDialog />
    </div>
  );
}
