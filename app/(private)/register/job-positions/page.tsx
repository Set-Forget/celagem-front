'use client';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { jobPositionsColumns } from './components/columns';
import Toolbar from './components/toolbar';
import { jobPositionsMock } from './mocks/job-positions-mock';
import { DataTable } from '@/components/data-table';

export default function JobPositionsPage() {
  const pathname = usePathname();
  const router = useRouter();

  // const { data, isLoading } = useListJobPositionsQuery({
  //   Name: '',
  //   CompanyId: '',
  // });

  return (
    <>
      <Header title="Puestos de trabajo">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear puesto de trabajo
        </Button>
      </Header>

      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={jobPositionsMock}
          columns={jobPositionsColumns}
          // loading={isLoading}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  );
}
