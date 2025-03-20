'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { classesColumns } from './components/columns';
import Toolbar from './components/toolbar';
import { useListClassesQuery } from '@/lib/services/classes';

export default function CompaniesPage() {
  const pathname = usePathname();
  const router = useRouter();

  const { data, isLoading } = useListClassesQuery({
    Name: '',
    CompanyId: '',
  });

  const classes = data?.data;

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!classes) {
    return <div>No se encontraron clases</div>;
  }

  return (
    <>
      <Header title="Compañias">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear clase
        </Button>
      </Header>

      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={classes}
          columns={classesColumns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  );
}
