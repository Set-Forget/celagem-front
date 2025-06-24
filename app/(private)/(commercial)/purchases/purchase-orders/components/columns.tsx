"use client";

import StatusBadge from "@/components/status-badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AdaptedPurchaseOrderList } from "@/lib/adapters/purchase-order";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const PercentageReceivedCell = ({ row }: { row: Row<AdaptedPurchaseOrderList> }) => {
  const percentageReceived = row.original.percentage_received;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Progress className="w-[200px]" value={percentageReceived} />
        </TooltipTrigger>
        <TooltipContent>{percentageReceived.toFixed()}%</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const columns: ColumnDef<AdaptedPurchaseOrderList>[] = [
  {
    accessorKey: "sequence_id",
    header: "Número",
    cell: ({ row }) => <div className="font-medium">{row.original.sequence_id}</div>,
  },
  {
    accessorKey: "supplier",
    header: "Proveedor",
    cell: ({ row }) => <div>{row.original.supplier.name}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      return <StatusBadge status={row.getValue("status")} />
    },
  },
  {
    accessorKey: "percentage_received",
    header: "Porcentaje recibido",
    cell: ({ row }) => <PercentageReceivedCell row={row} />,
  },
  {
    accessorKey: "price",
    header: "Total",
    cell: ({ row }) => (
      <div className="font-medium text-nowrap">
        {row.original.currency.name} {row.original.price}
      </div>
    ),
  },
  {
    accessorKey: "required_date",
    header: "Fecha de requerimiento",
    cell: ({ row }) => (
      <div>
        {row.original.required_date ? format(parseISO(row.original.required_date), "PP", { locale: es }) : "-"}
      </div>
    ),
  },
];
