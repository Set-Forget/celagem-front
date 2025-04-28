"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { PurchaseReceiptList } from "../schemas/purchase-receipts"
import { es } from "date-fns/locale"

export const columns: ColumnDef<PurchaseReceiptList>[] = [
  {
    accessorKey: "number",
    header: "Número",
    cell: ({ row }) => <div className="font-medium">{row.getValue("number")}</div>,
  },
  {
    accessorKey: "supplier",
    header: "Proveedor",
    cell: ({ row }) => <div>{row.getValue("supplier")}</div>,
  },
  {
    accessorKey: "reception_date",
    header: "Fecha de recepción",
    cell: ({ row }) => <div>
      {format(new Date(row.getValue("reception_date")), "PPP", { locale: es })}
    </div>,
  },
  {
    accessorKey: "reception_location",
    header: "Ubicación de recepción",
    cell: ({ row }) => <div>{row.getValue("reception_location")}</div>,
  },
  {
    accessorKey: "source_location",
    header: "Ubicación de origen",
    cell: ({ row }) => <div>{row.getValue("source_location")}</div>,
  }
]