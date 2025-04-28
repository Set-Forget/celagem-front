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
    accessorKey: "name",
    header: "Número",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
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
    accessorKey: "payment_method",
    header: "Método de pago",
    cell: ({ row }) => {
      return <div>xxxx</div>
    },
  },
  {
    accessorKey: "payment_date",
    header: "Fecha de pago",
    cell: ({ row }) => <div>
      xxxx
    </div>,
  },
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ row }) => <div className="font-medium">ARS {row.getValue("amount")}</div>,
  },
]