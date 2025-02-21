import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Box, ChevronDown, Eye, House, Paperclip } from 'lucide-react';
import Link from 'next/link';
import { proceduresMock } from '../mocks/medicalExamsMock';
import { DataTable } from '@/components/data-table';
import { columnsMaterials } from '../components/columnsMaterials';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const procedure = proceduresMock.find((proc) => proc.id === parseInt(id));

  return (
    <>
      <Header
        title={procedure?.code + ' - ' + procedure?.name || 'Procedimiento'}
      >
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-auto" size="sm">
              Crear
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/purchases/purchase-receipts/new">
                  Recepciones
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Registro de pago
              </DropdownMenuItem>
              <DropdownMenuItem>
                Nota de débito
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </Header>

      <div className="grid grid-cols-1 gap-4 p-4">
        <div className="p-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-100">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Código</label>
              <span className="text-sm">{procedure?.code}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Nombre</label>
              <span className="text-sm">{procedure?.name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Categoría</label>
              <span className="text-sm">{procedure?.category}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Descripción
              </label>
              <span className="text-sm">{procedure?.description}</span>
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">Materiales necesarios</h2>
          <div className="flex flex-col w-100">
            {procedure?.materials?.map((material, index) => (
              <div
                key={index}
                className="flex flex-row gap-3"
              >
                <span className=" text-muted-foreground text-sm w-24">
                  {material.code}
                </span>
                <label className="text-sm w-64">{material.name}</label>
                <span className="text-muted-foreground text-sm w-38">
                  Cantidad requerida:
                </span>{' '}
                <span className="text-sm">{material.qty_required}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
