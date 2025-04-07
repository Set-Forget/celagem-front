'use client';

import { DataTable } from '@/components/data-table';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ChevronDown } from 'lucide-react';
import { columns } from './components/columns';
import { generateDeliveryNotePDF } from '../../templates/delivery-note';

const data: any = [
  {
    item_code: 'ITEM-7882',
    item_name: 'Answer',
    description: 'Pattern tax these try dream.',
    delivered_quantity: 12,
    id: '7b140f23-e32b-4556-86c2-bedf237f43f5',
  },
  {
    item_code: 'ITEM-1814',
    item_name: 'Hear',
    description: 'Price cause debate leave situation result.',
    delivered_quantity: 1,
    id: '8ac65f9e-979f-4e54-b59d-0197511f7fd8',
  },
  {
    item_code: 'ITEM-2308',
    item_name: 'Seek',
    description: 'Subject collection young professor.',
    delivered_quantity: 35,
    id: '57515828-9775-4cf2-b37e-529aa5261dcd',
  },
  {
    item_code: 'ITEM-1691',
    item_name: 'Common',
    description: 'Bag challenge source two military.',
    delivered_quantity: 30,
    id: '5f04feb7-c416-4d2c-88f0-a3e8934ee033',
  },
  {
    item_code: 'ITEM-8413',
    item_name: 'Quite',
    description: 'Send full draw citizen air.',
    delivered_quantity: 47,
    id: 'e508cdfe-bcad-4c4c-9f3e-d6c5a27a20bb',
  },
];

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //const customerId = (await params).id

  const handleGeneratePDF = async () => {
    generateDeliveryNotePDF();
  };

  return (
    <div>
      <Header title="RC-2000342">
        <div className="ml-auto flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
              >
                Acciones
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => handleGeneratePDF()}
                >
                  Generar PDF
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                Crear
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Devolución de venta
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Factura de venta
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Header>
      <div className="flex flex-col gap-4 py-4 flex-1">
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Número de remito
              </label>
              <span className="text-sm">4500009257</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Cliente
              </label>
              <span className="text-sm">Miller PLC</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Fecha de entrega
              </label>
              <span className="text-sm">
                12 de febrero de 2022
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Sede
              </label>
              <span className="text-sm">Sede principal</span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">Productos</h2>
          <DataTable
            data={data}
            columns={columns}
            pagination={false}
          />
        </div>
        <Separator />
      </div>
    </div>
  );
}
