'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import Toolbar from './components/toolbar';
import { materialsColumns } from './components/columns';
import { usePathname, useRouter } from 'next/navigation';
import { materialsMock } from './mocks/materials';

export default function MaterialsPage() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <Header title="Materiales">
        <Button
          className="ml-auto"
          size="sm"
          asChild
        >
          <Link href={`${pathname}/new`}>
            <Plus className="w-4 h-4" />
            Crear material
          </Link>
        </Button>
      </Header>

      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={materialsMock}
          columns={materialsColumns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  );
}
