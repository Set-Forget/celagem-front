'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { classesColumns } from './components/columns';
import Toolbar from './components/toolbar';
import { useListClassesQuery } from '@/lib/services/classes';
import { setDialogsState } from '@/lib/store/dialogs-store';
import NewClass from './components/new-class-dialog';

export default function CompaniesPage() {
  const pathname = usePathname();
  const router = useRouter();

  const { data, isLoading } = useListClassesQuery({
    Name: '',
    CompanyId: '',
  });

  return (
    <>
      <Header title="Clases">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => {
            setDialogsState({
              open: 'new-class',
            });
          }}
        >
          <Plus className="w-4 h-4" />
          Crear clase
        </Button>
      </Header>

      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={data?.data || []}
          columns={classesColumns}
          loading={isLoading}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
      <NewClass />
    </>
  );
}
