'use client';

import Header from '@/components/header';

import { jobPositionsMock } from '../mocks/jobPositionsMock';
import { Button } from '@/components/ui/button';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function JobPositionPage() {
  const { id } = useParams();
  const pathname = usePathname()

  const jobPosition = jobPositionsMock.find(
    (proc) => proc.id === parseInt(id as string)
  );

  return (
    <>
      <Header title={jobPosition?.code || 'Puesto de trabajo'}>
        <div className="ml-auto flex gap-2">
          <Button
            type="submit"
            size="sm"
          >
            <Link href={`${pathname}/edit`}>Editar puesto de trabajo</Link>
          </Button>
        </div>
      </Header>

      <div className="grid grid-cols-1 gap-4 p-4">
        <div className="p-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-100">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Código</label>
              <span className="text-sm">{jobPosition?.code}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Costo total
              </label>
              <span className="text-sm">{jobPosition?.total_cost}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Unidad</label>
              <span className="text-sm">{jobPosition?.unit}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Costo por Unidad
              </label>
              <span className="text-sm">{jobPosition?.unit_cost}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
