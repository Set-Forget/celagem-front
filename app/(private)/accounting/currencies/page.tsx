'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useListCurrenciesQuery } from '@/lib/services/currencies';
import { setDialogsState } from '@/lib/store/dialogs-store';
import { Plus } from 'lucide-react';
import { columns } from './components/columns';
import EditCurrencyDialog from './components/edit-currency-dialog';
import NewCurrencyDialog from './components/new-currency-dialog';
import Toolbar from './components/toolbar';
import CurrencyDetailsDialog from './components/view-currency-dialog';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();

  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }

  const { data: currencies, isLoading: isLoadingCurrencies } = useListCurrenciesQuery();

  const searchName = search.field === "name" ? search?.query : undefined

  return (
    <>
      <Header title="Monedas">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => setDialogsState({ open: 'new-currency' })}
        >
          <Plus className="w-4 h-4" />
          Crear moneda
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={currencies?.data
            ?.filter((currency) => {
              if (searchName) {
                return currency.name.toLowerCase().includes(searchName?.toLowerCase() || '')
              }
              return true
            })
            || []}
          columns={columns}
          loading={isLoadingCurrencies}
          onRowClick={(row) => setDialogsState({ open: 'currency-details', payload: { currency_id: row.id } })}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
      <CurrencyDetailsDialog />
      <NewCurrencyDialog />
      <EditCurrencyDialog />
    </>
  );
}
