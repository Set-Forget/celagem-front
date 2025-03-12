'use client';

import Header from '@/components/header';
import { servicesMock } from '../mocks/servicesMock';
import { Button } from '@/components/ui/button';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ProductPage() {
  
  const { id } = useParams();
  const pathname = usePathname()

  const service = servicesMock.find((proc) => proc.id === parseInt(id as string));

  return (
    <>
      <Header title={service?.code || 'Servicio'}>
        <div className="ml-auto flex gap-2">
          <Button
            type="submit"
            size="sm"
          >
            <Link href={`${pathname}/edit`}>
              Editar servicio
            </Link>
          </Button>
        </div>
      </Header>

      <div className="grid grid-cols-1 gap-4 p-4">
        <div className="p-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-100">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Código</label>
              <span className="text-sm">{service?.code}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Costo Total
              </label>
              <span className="text-sm">{service?.total_cost}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Unidad</label>
              <span className="text-sm">{service?.unit}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Costo Unitario
              </label>
              <span className="text-sm">{service?.unit_cost}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
