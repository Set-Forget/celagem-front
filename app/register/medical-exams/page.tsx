'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import Toolbar from './components/toolbar';
import { medicalExamsColumns } from './components/columns';
import { usePathname, useRouter } from 'next/navigation';
import { medicalExamsMock } from './mocks/medicalExamsMock';

export default function ProductsPage() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <Header title="Examenes Medicos">
        <Button
          className="ml-auto"
          size="sm"
          asChild
        >
          <Link href={`${pathname}/new`}>
            <Plus className="w-4 h-4" />
            Crear examen medico
          </Link>
        </Button>
      </Header>

      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={medicalExamsMock}
          columns={medicalExamsColumns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  );
}
