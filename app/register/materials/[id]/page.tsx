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
import { materialsMock } from '../mocks/materials';

export default async function MaterialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const materialId = (await params).id;

  const material = materialsMock.find(
    (material) => material.id === parseInt(materialId)
  );

  return (
    <>
      <Header title={material?.code + ' - ' + material?.name || 'Material'}>
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
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-medium">General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Código
              </label>
              <span className="text-sm">
                {material?.code}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Nombre
              </label>
              <span className="text-sm">
                ${material?.name}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Stock disponible
              </label>
              <span className="text-sm">20 unidades</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
