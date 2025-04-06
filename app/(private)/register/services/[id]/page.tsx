'use client';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { servicesMock } from '../mocks/servicesMock';

export default function Page() {
  const router = useRouter();
  const pathname = usePathname()

  const { id } = useParams();

  const service = servicesMock.find((proc) => proc.id === parseInt(id as string));

  return (
    <div>
      <Header title={service?.code || 'Servicio'}>
        <div className="ml-auto flex gap-2">
          <Button
            type="submit"
            size="sm"
            onClick={() => router.push(`${pathname}/edit`)}
          >
            Editar servicio
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
    </div>
  );
}
