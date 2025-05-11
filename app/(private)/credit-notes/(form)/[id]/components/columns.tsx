"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CreditNoteItem } from "../../../schemas/credit-notes"

export const columns: ColumnDef<CreditNoteItem & { currency: string }>[] = [
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
      return <div className="font-medium">{row.getValue("quantity")}</div>
    },
  },
  {
    accessorKey: "price_unit",
    header: "Precio unitario",
    cell: ({ row }) => {
      return <span className="font-medium">{row.original.currency} {row.original.price_unit.toFixed(2)}</span>
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
                "badge group-hover:border group-hover:border-border group-hover:shadow-border bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-secondary"
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
                        "badge group-hover:border group-hover:border-border group-hover:shadow-border bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-secondary"
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
                          "badge group-hover:border group-hover:border-border group-hover:shadow-border bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-secondary"
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
    accessorKey: "price_subtotal",
    header: "Subtotal (sin imp.)",
    cell: ({ row }) => <span className="font-medium">{row.original.currency} {row.original.price_subtotal.toFixed(2)}</span>,
  },
]