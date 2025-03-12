'use client';

import { DataTable } from '@/components/data-table';
import { servicesColumns } from './columns';
import { usePathname, useRouter } from 'next/navigation';
import Toolbar from './toolbar';
import { servicesMock } from '../mocks/servicesMock';

export function ServicesDataTable() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
      <DataTable
        data={servicesMock}
        columns={servicesColumns}
        onRowClick={(row) => router.push(`${pathname}/procedures/${row.id}`)}
        toolbar={({ table }) => <Toolbar table={table} />}
      />
    </div>
  );
}
