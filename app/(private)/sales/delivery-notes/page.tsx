'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { useListDeliveriesQuery } from '@/lib/services/deliveries';
import { usePathname, useRouter } from 'next/navigation';
import { columns } from './components/columns';
import Toolbar from './components/toolbar';

export default function Page() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: deliveries, isLoading: isDeliveriesLoading } = useListDeliveriesQuery();

  return (
    <div>
      <Header title='Remitos' />
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={deliveries?.data ?? []}
          loading={isDeliveriesLoading}
          columns={columns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </div>
  );
}
