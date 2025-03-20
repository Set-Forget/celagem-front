'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { companiesColumns } from './components/columns';
import Toolbar from './components/toolbar';
import { useListCompaniesQuery } from '@/lib/services/companies';

export default function CompaniesPage() {
  const pathname = usePathname();
  const router = useRouter();

  const { data, isLoading } = useListCompaniesQuery();

  const companies = data?.data;

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!companies) {
    return <div>No se encontraron compañias</div>;
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
          Crear compañia
        </Button>
      </Header>

      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={companies}
          columns={companiesColumns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  );
}
