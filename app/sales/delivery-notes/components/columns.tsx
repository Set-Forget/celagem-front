'use client';

import { ColumnDef } from '@tanstack/react-table';

import { format } from 'date-fns';
import { DeliveryNote } from '../schemas/delivery-notes';

export const columns: ColumnDef<DeliveryNote>[] = [
  {
    accessorKey: 'source_document',
    header: 'Número',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('source_document')}</div>
    ),
  },
  {
    accessorKey: 'customer',
    header: 'Cliente',
    cell: ({ row }) => <div>{row.getValue('customer')}</div>,
  },
  {
    accessorKey: 'delivered_at',
    header: 'Fecha de entrega',
    cell: ({ row }) => (
      <div>
        {format(new Date(row.getValue('delivered_at')), 'dd MMM yyyy')}
      </div>
    ),
  },
  /*   {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/purchases/purchase-receipts/${row.original.id}`}>
                Ver detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => generatePurchaseReceiptPDF()}>
              Descargar PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }, */
];
