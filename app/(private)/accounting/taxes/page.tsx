'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useListTaxesQuery } from '@/lib/services/taxes';
import { setDialogsState } from '@/lib/store/dialogs-store';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { columns } from './components/columns';
import EditTaxDialog from './components/edit-tax-dialog';
import NewTaxDialog from './components/new-tax-dialog';
import Toolbar from './components/toolbar';
import TaxDetailsDialog from './components/view-tax-dialog';
import { taxKinds } from './utils';

export default function Page() {
  const searchParams = useSearchParams();

  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }

  const { data: taxes, isLoading: isLoadingTaxes } = useListTaxesQuery();

  const searchName = search.field === "name" ? search?.query : undefined
  const searchType = search.field === "tax_kind" ? search?.query : undefined

  return (
    <>
      <Header title="Impuestos">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => setDialogsState({ open: 'new-tax' })}
        >
          <Plus className="w-4 h-4" />
          Crear impuesto
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={taxes?.data
            .filter((tax) => {
              if (searchName) {
                return tax.name.toLowerCase().includes(searchName.toLowerCase())
              }
              if (searchType) {
                return taxKinds[tax.tax_kind].toLowerCase().includes(searchType.toLowerCase())
              }
              return true
            })
            || []}
          columns={columns}
          loading={isLoadingTaxes}
          onRowClick={(row) => setDialogsState({ open: 'tax-details', payload: { tax_id: row.id } })}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
      <NewTaxDialog />
      <TaxDetailsDialog />
      <EditTaxDialog />
    </>
  );
}
