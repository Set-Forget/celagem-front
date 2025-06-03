"use client"

import {
	ColumnDef
} from "@tanstack/react-table"
import { DeliveryNoteItem } from "../../../schemas/delivery-notes"

export const columns: ColumnDef<DeliveryNoteItem>[] = [
	{
		accessorKey: "display_name",
		header: "Producto / Servicio",
		size: 300,
		cell: ({ row }) => (
			<div className="font-medium text-nowrap">
				{row.getValue("display_name")}
			</div>
		),
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
		header: "Cantidad ordenada",
		cell: ({ row }) => {
			return <div>{row.getValue("quantity")}</div>
		},
	},
	{
		accessorKey: "product_uom_qty",
		header: "Cantidad recibida",
		cell: ({ row }) => {
			return <div>{row.getValue("product_uom_qty")}</div>
		},
	}
]