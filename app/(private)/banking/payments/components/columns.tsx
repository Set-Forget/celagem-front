"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PaymentList } from "../schemas/payments"
import { paymentStatus } from "../utils"

export const columns: ColumnDef<PaymentList>[] = [
  {
    accessorKey: "sequence_id",
    header: "Número",
    cell: ({ row }) => <div className="font-medium">{row.getValue("sequence_id")}</div>,
  },
  {
    accessorKey: "state",
    header: "Estado",
    cell: ({ row }) => {
      const status = paymentStatus[row.getValue("state") as keyof typeof paymentStatus];

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
    accessorKey: 'journal',
    header: 'Diario',
    cell: ({ row }) => <div>{row.getValue("journal")}</div>,
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
      {row.original.currency} {row.getValue("amount")}
    </div>,
  },
]