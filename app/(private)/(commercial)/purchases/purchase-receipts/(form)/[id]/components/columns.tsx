"use client"

import { AdaptedPurchaseReceiptDetail } from "@/lib/adapters/purchase-receipts"
import {
  ColumnDef
} from "@tanstack/react-table"

export const columns: ColumnDef<AdaptedPurchaseReceiptDetail["items"][number]>[] = [
  {
    accessorKey: "product_name",
    header: "Producto / Servicio",
    size: 300,
    cell: ({ row }) => <div className="flex gap-1 text-nowrap">
      <span className="font-medium text-nowrap">
        {row.original.product_code}
      </span>
      -{" "}
      {row.original.product_name}
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