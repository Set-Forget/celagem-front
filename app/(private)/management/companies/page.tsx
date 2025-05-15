'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { companiesColumns } from './components/columns';
import Toolbar from './components/toolbar';
import { useLazyListCompaniesQuery, useListCompaniesQuery } from '@/lib/services/companies';
import { setDialogsState } from '@/lib/store/dialogs-store';
import NewCompany from './components/new-company';
import { useEffect } from 'react';

export default function CompaniesPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [handleCompanies, { data: companies, isLoading }] = useLazyListCompaniesQuery();

  useEffect(() => {
    handleCompanies();
  }, []);

  return (
    <>
      <Header title="Sedes">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => {
            setDialogsState({
              open: 'new-company',
            });
          }}
        >
          <Plus className="w-4 h-4" />
          Crear sede
        </Button>
      </Header>

      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={companies?.data || []}
          columns={companiesColumns}
          loading={isLoading}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
      <NewCompany />
    </>
  );
}
