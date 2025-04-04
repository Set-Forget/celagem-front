"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

import { format } from "date-fns"
import { PAYMENT_MODE_ADAPTER } from "../adapters/payments"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "transaction_id",
    header: "ID de transacción",
    cell: ({ row }) => <div className="font-medium">{row.getValue("transaction_id")}</div>,
  },
  {
    accessorKey: "payment_mode",
    header: "Modo de pago",
    cell: ({ row }) => {
      return <div>{PAYMENT_MODE_ADAPTER[row.getValue("payment_mode") as keyof typeof PAYMENT_MODE_ADAPTER]}</div>
    },
  },
  {
    accessorKey: "payment_date",
    header: "Fecha de pago",
    cell: ({ row }) => <div>
      {format(new Date(row.getValue("payment_date")), "dd MMM yyyy")}
    </div>,
  },
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ row }) => <div className="font-medium">ARS {row.getValue("amount")}</div>,
  },
]