"use client"

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table"
import * as React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { BillItem } from "../../schemas/bills"
import { columns } from "./columns"

const data: BillItem[] = [
  {
    "item_code": "ITEM-9634",
    "item_name": "Guantes de nitrilo",
    "description": "Guantes de nitrilo talla M",
    "quantity": 50,
    "id": "5e7361f5-0fbf-433b-8688-b65896a0f54a",
    "price": "400.93",
    "tax": "21",
  },
]

const PAGE_SIZE = 15

export function PurchaseOrderItemsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: PAGE_SIZE,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="flex flex-col">
      <div className="rounded-sm border flex flex-col">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody scrollBarClassName="pt-[42px]">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn("border-b-0")}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-background">
              <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0">
                <span>Subtotal</span>
              </TableCell>
              <TableCell className="h-6 text-xs font-medium py-0">
                <span>ARS 400.93</span>
              </TableCell>
            </TableRow>
            <TableRow className="bg-background">
              <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0">
                <span>Impuestos</span>
              </TableCell>
              <TableCell className="h-6 text-xs font-medium py-0">
                <span>ARS 84.00</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0">
                <span>Total</span>
              </TableCell>
              <TableCell className="h-6 text-xs font-medium py-0">
                <span>ARS 484.93</span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
