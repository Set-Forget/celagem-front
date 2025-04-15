'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { businessUnitsColumns } from './components/columns';
// import Toolbar from './components/toolbar';
import { useListBusinessUnitsQuery } from '@/lib/services/business-units';
import Toolbar from './components/toolbar';

export default function BusinessUnitsPage() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: businessUnits, isLoading } = useListBusinessUnitsQuery({
    CompanyId: '',
    Name: '',
  });

  return (
    <>
      <Header title="Unidades de negocio">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear unidad de negocio
        </Button>
      </Header>

      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={businessUnits?.data || []}
          loading={isLoading}
          columns={businessUnitsColumns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  );
}
