'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { productTemplatesColumns } from './components/columns';
import Toolbar from './components/toolbar';
import { useListProductTemplatesQuery } from '@/lib/services/product-templates';

export default function MaterialsPage() {
  const pathname = usePathname();
  const router = useRouter();

  const { data, isLoading } = useListProductTemplatesQuery();

  return (
    <>
      <Header title="Materiales">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear producto
        </Button>
      </Header>

      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={data?.data ?? []}
          columns={productTemplatesColumns}
          loading={isLoading}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  );
}
