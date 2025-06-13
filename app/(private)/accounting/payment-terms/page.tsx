'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useListPaymentTermsQuery } from '@/lib/services/payment-terms';
import { setDialogsState } from '@/lib/store/dialogs-store';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { columns } from './components/columns';
import Toolbar from './components/toolbar';
import ViewPaymentTermDialog from './components/view-payment-term-dialog';

export default function Page() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: paymentTerms, isLoading: isLoadingPaymentTerms } = useListPaymentTermsQuery();

  return (
    <>
      <Header title="Términos de pago">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear término de pago
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={paymentTerms?.data || []}
          columns={columns}
          loading={isLoadingPaymentTerms}
          onRowClick={(row) => setDialogsState({ open: 'view-payment-term', payload: { payment_term_id: row.id } })}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
      <ViewPaymentTermDialog />
    </>
  );
}
