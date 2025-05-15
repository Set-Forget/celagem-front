'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { columns } from './components/columns';
import Toolbar from './components/toolbar';
import { useListTaxesQuery } from '@/lib/services/taxes';
import { useListPaymentTermsQuery } from '@/lib/services/payment-terms';

export default function PaymentTermsPage() {
  const pathname = usePathname();
  const router = useRouter();

  const { data, isLoading } = useListPaymentTermsQuery();

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
          data={data?.data || []}
          columns={columns}
          loading={isLoading}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  );
}
