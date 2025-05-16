"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { BillItem } from "../../../schemas/bills"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const columns: ColumnDef<BillItem & { currency: string }>[] = [
  {
    accessorKey: "product_name",
    header: "Nombre",
    cell: ({ row }) => {
      return <span className="font-medium">
        {row.getValue("product_name")}
      </span>
    },
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
    cell: ({ row }) => {
      return <div>{row.getValue("quantity")}</div>
    },
  },
  {
    accessorKey: "price_unit",
    header: "Precio unitario",
    cell: ({ row }) => {
      return <span>{row.original.currency} {row.original.price_unit.toFixed(2)}</span>
    },
  },
  {
    accessorKey: "taxes",
    header: "Impuestos",
    cell: ({ row }) => {
      const taxes = row.original.taxes;
      const maxCount = 3;

      if (!taxes || taxes.length === 0) {
        return
      }

      const visibleTaxes = taxes.slice(0, maxCount);
      const hiddenTaxes = taxes.slice(maxCount);

      return (
        <div className="flex items-center gap-1">
          {visibleTaxes.map((tax, index) => (
            <Badge
              key={tax.id || index}
              className={cn(
                "badge group-hover:bg-background group-hover:shadow-background bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-secondary"
              )}
            >
              {tax.name}
            </Badge>
          ))}
          {hiddenTaxes.length > 0 && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span role="button" tabIndex={0}>
                    <Badge
                      className={cn(
                        "badge group-hover:bg-background group-hover:shadow-background bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-secondary"
                      )}
                    >
                      {`+ ${hiddenTaxes.length} más`}
                    </Badge>
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-background shadow-lg border border-border p-1 rounded-sm">
                  <div className="flex flex-col gap-1">
                    {hiddenTaxes.map((tax, index) => (
                      <Badge
                        key={tax.id || index}
                        className={cn(
                          "badge group-hover:bg-background group-hover:shadow-background bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-secondary"
                        )}
                      >
                        {tax.name}
                      </Badge>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "account",
    header: "Cuenta contable",
    cell: ({ row }) => row.original.account.name ?? "No asignada",
  },
  {
    accessorKey: "cost_center",
    header: "Centro de costo",
    cell: ({ row }) => row.original.cost_center?.name,
  },
  {
    accessorKey: "price_subtotal",
    header: "Subtotal (sin imp.)",
    cell: ({ row }) => <span className="font-medium">{row.original.currency} {row.original.price_subtotal.toFixed(2)}</span>,
  },
]