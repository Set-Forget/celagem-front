'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useListPaymentMethodsQuery } from '@/lib/services/payment-methods';
import { setDialogsState } from '@/lib/store/dialogs-store';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { columns } from './components/columns';
import Toolbar from './components/toolbar';
import ViewPaymentMethodDialog from './components/view-payment-method-dialog';
import NewPaymentMethodDialog from './components/new-payment-method-dialog';
import EditPaymentMethodDialog from './components/edit-payment-method-dialog';

export default function Page() {

  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = useListPaymentMethodsQuery();

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
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={paymentMethods?.data || []}
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
