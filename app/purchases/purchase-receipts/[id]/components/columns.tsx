"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { PurchaseReceiptItems } from "../../schemas/purchase-receipts"

export const columns: ColumnDef<PurchaseReceiptItems>[] = [
  {
    accessorKey: "display_name",
    header: "Producto",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("display_name")}
      </div>
    ),
  },
  {
    accessorKey: "product_uom_qty",
    header: "Cantidad recibida",
    cell: ({ row }) => {
      return <div>{row.getValue("product_uom_qty")}</div>
    },
  },
]