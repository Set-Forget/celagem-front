'use client';

import { DataTable } from '@/components/data-table';
import { jobPositionsColumns } from './columns';
import { usePathname, useRouter } from 'next/navigation';
import Toolbar from './toolbar';
import { proceduresMock } from '../mocks/jobPositionsMock';
import { useEffect } from 'react';

export function ProcedureDataTable() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
      <DataTable
        data={proceduresMock}
        columns={jobPositionsColumns}
        onRowClick={(row) => router.push(`${pathname}/procedures/${row.id}`)}
        toolbar={({ table }) => <Toolbar table={table} />}
      />
    </div>
  );
}
