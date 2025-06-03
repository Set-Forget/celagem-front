"use client"

import {
  ColumnDef
} from "@tanstack/react-table"
import { PurchaseRequestItem } from "../../../schemas/purchase-requests"

export const columns: ColumnDef<PurchaseRequestItem>[] = [
  {
    accessorKey: "product_name",
    header: "Producto / Servicio",
    cell: ({ row }) => <div className="flex gap-1">
      <span className="font-medium text-nowrap">
        {row.original.id}
      </span>
      -{" "}
      {row.original.product_name}
    </div>
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
    cell: ({ row }) => {
      return <div>{row.getValue("quantity")}</div>
    },
  }
]