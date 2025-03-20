'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { businessUnitsColumns } from './components/columns';
import Toolbar from './components/toolbar';
import { useListBusinessUnitsQuery } from '@/lib/services/business-units';

export default function BusinessUnitsPage() {
  const pathname = usePathname();
  const router = useRouter();

  const { data, isLoading } = useListBusinessUnitsQuery({
    CompanyId: '',
    Name: '',
  });

  const businessUnits = data?.data;

  if (isLoading) {
    return <div>Cargando...</div>;
  }
  if (!businessUnits) {
    return <div>No hay unidades de negocio</div>;
  }

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
          data={businessUnits}
          columns={businessUnitsColumns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  );
}
