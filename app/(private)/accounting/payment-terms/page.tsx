'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useListPaymentTermsQuery } from '@/lib/services/payment-terms';
import { setDialogsState } from '@/lib/store/dialogs-store';
import { Plus } from 'lucide-react';
import { columns } from './components/columns';
import EditPaymentTermDialog from './components/edit-payment-term-dialog';
import NewPaymentTermDialog from './components/new-payment-term-dialog';
import Toolbar from './components/toolbar';
import ViewPaymentTermDialog from './components/view-payment-term-dialog';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();

  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }

  const { data: paymentTerms, isLoading: isLoadingPaymentTerms } = useListPaymentTermsQuery();

  const searchName = search.field === "name" ? search?.query : undefined

  return (
    <>
      <Header title="Términos de pago">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => setDialogsState({ open: 'new-payment-term' })}
        >
          <Plus className="w-4 h-4" />
          Crear término de pago
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={paymentTerms?.data
            .filter((paymentTerm) => {
              if (searchName) {
                return paymentTerm.name.toLowerCase().includes(searchName.toLowerCase())
              }
              return true
            }) || []}
          columns={columns}
          loading={isLoadingPaymentTerms}
          onRowClick={(row) => setDialogsState({ open: 'view-payment-term', payload: { payment_term_id: row.id } })}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
      <ViewPaymentTermDialog />
      <NewPaymentTermDialog />
      <EditPaymentTermDialog />
    </>
  );
}
