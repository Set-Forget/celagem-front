'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { materialsInventoryEntriesColumns } from './components/columns';
import Toolbar from './components/toolbar';
import { materialsInventoryMock } from './mocks/materials-inventory';

export default function ProductsPage() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <Header title="Inventario de Materiales">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear entrada
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)] [&_*[data-table='true']]:w-[calc(100svw-308px)]">
        <DataTable
          data={materialsInventoryMock}
          columns={materialsInventoryEntriesColumns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  );
}
