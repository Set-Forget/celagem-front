"use client"

import {
  ColumnDef
} from "@tanstack/react-table"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "item_code",
    header: "Código",
    cell: ({ row }) => (
      <div>
        {row.getValue("item_code")}
      </div>
    ),
  },
  {
    accessorKey: "item_name",
    header: "Nombre",
    cell: ({ row }) => {
      return <div>{row.getValue("item_name")}</div>
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("quantity")}</div>
    },
  },
  {
    accessorKey: "tax",
    header: "Impuesto",
    cell: ({ row }) => <div>{row.getValue("tax")}%</div>,
  },
  {
    accessorKey: "price",
    header: "Subtotal",
    cell: ({ row }) => <div className="font-medium">ARS {row.getValue("price")}</div>,
  },
]