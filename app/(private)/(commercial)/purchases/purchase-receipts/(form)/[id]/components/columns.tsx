"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { PurchaseReceiptItem } from "../../../schemas/purchase-receipts"

export const columns: ColumnDef<PurchaseReceiptItem>[] = [
  {
    accessorKey: "display_name",
    header: "Producto / Servicio",
    size: 300,
    cell: ({ row }) => <div className="flex gap-1 text-nowrap">
      <span className="font-medium text-nowrap">
        {row.original.product_code}
      </span>
      -{" "}
      {row.original.display_name.replace(/^\[[^\]]+\]\s*/, "")}
    </div>
  },
  {
    accessorKey: "product_uom",
    header: "Unidad de medida",
    cell: ({ row }) => {
      return <div>{row.original.product_uom.name}</div>
    },
  },
  {
    accessorKey: "quantity",
    header: "Cantidad recibida",
    cell: ({ row }) => {
      return <div>{row.getValue("quantity")}</div>
    },
  }
]