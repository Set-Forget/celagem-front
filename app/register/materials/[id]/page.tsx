'use client';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { House } from 'lucide-react';
import Link from 'next/link';
import { materialsMock } from '../mocks/materials';
import { useParams, usePathname } from 'next/navigation';

export default function MaterialPage() {
  const pathname = usePathname();
  const { id } = useParams();

  const materialId = id as string;

  const material = materialsMock.find(
    (material) => material.id === parseInt(materialId)
  );

  return (
    <>
      <Header title={material?.code + ' - ' + material?.name}>
        <div className="ml-auto flex gap-2">
          <Button
            type="submit"
            size="sm"
          >
            <Link href={`${pathname}/edit`}>Editar material</Link>
          </Button>
        </div>
      </Header>
      <Tabs
        className="mt-4"
        defaultValue="tab-1"
      >
        <ScrollArea>
          <TabsList className="relative justify-start !pl-4 h-auto w-full gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
            <TabsTrigger
              value="tab-1"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <House
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              General
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent
          value="tab-1"
          className="m-0 p-1"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            {material?.brand && (
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Marca</label>
                <span className="text-sm">{material?.brand ?? 'Generico'}</span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Fracción</label>
              <span className="text-sm">{material?.fraction}</span>
            </div>
            {material?.purchase_unit && (
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">
                  Unidad de compra
                </label>
                <span className="text-sm">{material?.purchase_unit}</span>
              </div>
            )}
            {material?.cost_unit && (
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">
                  Unidad de costo
                </label>
                <span className="text-sm">{material?.cost_unit}</span>
              </div>
            )}
            {material?.convertion_rate_purchase_to_cost_unit && (
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">
                  Tasa de conversión de unidad compra a unidad costo
                </label>
                <span className="text-sm">
                  {material?.convertion_rate_purchase_to_cost_unit}
                </span>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
