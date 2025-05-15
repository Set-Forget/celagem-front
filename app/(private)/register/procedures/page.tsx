'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { proceduresColumns } from './components/columns';
import Toolbar from './components/toolbar';
import { proceduresMock } from './mocks/procedures-mock';
import { useListProceduresQuery } from '@/lib/services/procedures';

export default function Page() {
  const pathname = usePathname();
  const router = useRouter();

  // const { data, isLoading } = useListProceduresQuery({
  //   Name: '',
  //   CompanyId: '',
  // });

  return (
    <div>
      <Header title="Actos Clinicos">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear acto clinico
        </Button>
      </Header>

      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={proceduresMock}
          columns={proceduresColumns}
          // loading={isLoading}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </div>
  );
}
