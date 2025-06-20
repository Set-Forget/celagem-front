'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useListPaymentMethodLinesQuery } from '@/lib/services/payment-methods';
import { setDialogsState } from '@/lib/store/dialogs-store';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { columns } from './components/columns';
import EditPaymentMethodDialog from './components/edit-payment-method-dialog';
import NewPaymentMethodDialog from './components/new-payment-method-dialog';
import Toolbar from './components/toolbar';
import ViewPaymentMethodDialog from './components/view-payment-method-dialog';

export default function Page() {
  const searchParams = useSearchParams();

  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }

  const { data: paymentMethodLines, isLoading: isLoadingPaymentMethods } = useListPaymentMethodLinesQuery();

  const searchName = search.field === "name" ? search?.query : undefined
  const searchPaymentAccount = search.field === "payment_account" ? search?.query : undefined

  return (
    <>
      <Header title="Métodos de pago">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => setDialogsState({ open: 'new-payment-method' })}
        >
          <Plus className="w-4 h-4" />
          Crear método de pago
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={paymentMethodLines?.data
            .filter((paymentMethodLine) => {
              if (searchName) {
                return paymentMethodLine.payment_method.toLowerCase().includes(searchName.toLowerCase())
              }
              if (searchPaymentAccount) {
                return (paymentMethodLine.payment_account || "").toLowerCase().includes(searchPaymentAccount.toLowerCase())
              }
              return true
            }) || []}
          columns={columns}
          loading={isLoadingPaymentMethods}
          onRowClick={(row) => setDialogsState({ open: 'view-payment-method', payload: { payment_method_id: row.id } })}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
      <ViewPaymentMethodDialog />
      <NewPaymentMethodDialog />
      <EditPaymentMethodDialog />
    </>
  );
}
