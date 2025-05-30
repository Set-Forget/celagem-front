'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { useListDeliveriesQuery } from '@/lib/services/deliveries';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { columns } from './components/columns';
import Toolbar from './components/toolbar';

export default function Page() {
  const searchParams = useSearchParams()
  const pathname = usePathname();
  const router = useRouter();

  const received_at = JSON.parse(searchParams.get('date_range') || '{}') as { field: string, from: string, to: string }
  const search = JSON.parse(searchParams.get('search') || '{}') as { field: string, query: string }

  const { data: deliveries, isLoading: isDeliveriesLoading } = useListDeliveriesQuery({
    received_at_start: received_at?.field === "received_at" ? received_at.from : undefined,
    received_at_end: received_at?.field === "received_at" ? received_at.to : undefined,
    number: search?.query,
  }, { refetchOnMountOrArgChange: true })

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
