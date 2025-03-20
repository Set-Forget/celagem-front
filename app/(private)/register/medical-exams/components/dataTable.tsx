'use client';

import { DataTable } from '@/components/data-table';
import { medicalExamsColumns } from './columns';
import { usePathname, useRouter } from 'next/navigation';
import Toolbar from './toolbar';
import { useEffect } from 'react';
import { proceduresMock } from '../../procedures/mocks/proceduresMock';

export function ProcedureDataTable() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
      <DataTable
        data={proceduresMock as any}
        columns={medicalExamsColumns}
        onRowClick={(row) => router.push(`${pathname}/procedures/${row.id}`)}
        toolbar={({ table }) => <Toolbar table={table} />}
      />
    </div>
  );
}
