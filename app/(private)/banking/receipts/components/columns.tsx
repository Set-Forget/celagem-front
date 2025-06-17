"use client"

import { Badge } from "@/components/ui/badge"
import { cn, formatNumber } from "@/lib/utils"
import {
  ColumnDef
} from "@tanstack/react-table"
import { ChargeList } from "../schemas/receipts"
import { chargeStatus } from "../utils"

export const columns: ColumnDef<ChargeList>[] = [
  {
    accessorKey: "sequence_id",
    header: "Número",
    cell: ({ row }) => <div className="font-medium">{row.getValue("sequence_id")}</div>,
  },
  {
    accessorKey: "state",
    header: "Estado",
    cell: ({ row }) => {
      const status = chargeStatus[row.getValue("state") as keyof typeof chargeStatus];

      return (
        <Badge
          variant="custom"
          className={cn(`${status?.bg_color} ${status?.text_color} border-none rounded-sm`)}
        >
          {status?.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "partner",
    header: "Proveedor",
    cell: ({ row }) => <div>{row.getValue("partner")}</div>,
  },
  {
    accessorKey: "source_account",
    header: "Cuenta origen",
    cell: ({ row }) => <div>{row.getValue("source_account")}</div>,
  },
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ row }) => <div className="font-medium">
      {row.original.currency} {formatNumber(row.getValue("amount"))}
    </div>,
  },
]