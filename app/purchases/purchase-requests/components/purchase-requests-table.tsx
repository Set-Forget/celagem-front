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
import { ChevronDown, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { columns } from "./columns"
import { PurchaseRequest } from "../schemas/purchase-requests"
import Link from "next/link"

const data: PurchaseRequest[] = [
  {
    "title": "Compra de guantes quirúrgicos",
    "status": "cancelled",
    "requested_by": "Larry Hughes",
    "required_by": "2024-12-03T16:51:19.750031",
    "created_at": "2024-11-29T16:51:19.750060",
    "id": 1
  },
  {
    "title": "Reposición de batas médicas",
    "status": "ordered",
    "requested_by": "Christopher Williams",
    "required_by": "2024-12-28T16:51:19.750466",
    "created_at": "2024-11-29T16:51:19.750484",
    "id": 2
  },
  {
    "title": "Adquisición de alcohol en gel",
    "status": "pending",
    "requested_by": "Alicia Sawyer",
    "required_by": "2024-12-03T16:51:19.750877",
    "created_at": "2024-11-29T16:51:19.750894",
    "id": 3
  },
  {
    "title": "Compra de mascarillas N95",
    "status": "ordered",
    "requested_by": "Katherine James",
    "required_by": "2024-12-04T16:51:19.751217",
    "created_at": "2024-11-29T16:51:19.751232",
    "id": 4
  },
  {
    "title": "Renovación de instrumental quirúrgico",
    "status": "pending",
    "requested_by": "Michael Mills",
    "required_by": "2024-11-30T16:51:19.751547",
    "created_at": "2024-11-29T16:51:19.751557",
    "id": 5
  },
  {
    "title": "Solicitud de jeringas descartables",
    "status": "pending",
    "requested_by": "George Mcmillan",
    "required_by": "2024-12-09T16:51:19.751872",
    "created_at": "2024-11-29T16:51:19.751882",
    "id": 6
  },
  {
    "title": "Compra de gasas esterilizadas",
    "status": "pending",
    "requested_by": "Joseph Morris",
    "required_by": "2024-12-27T16:51:19.752173",
    "created_at": "2024-11-29T16:51:19.752184",
    "id": 7
  },
  {
    "title": "Adquisición de termómetros digitales",
    "status": "pending",
    "requested_by": "Ryan Oneill",
    "required_by": "2024-11-30T16:51:19.752495",
    "created_at": "2024-11-29T16:51:19.752509",
    "id": 8
  },
  {
    "title": "Compra de uniformes médicos",
    "status": "ordered",
    "requested_by": "Travis Miller",
    "required_by": "2024-12-12T16:51:19.752812",
    "created_at": "2024-11-29T16:51:19.752821",
    "id": 9
  },
  {
    "title": "Pedido de estetoscopios",
    "status": "ordered",
    "requested_by": "Sherry Thomas",
    "required_by": "2024-12-14T16:51:19.753092",
    "created_at": "2024-11-29T16:51:19.753102",
    "id": 10
  },
  {
    "title": "Compra de equipos de oxigenoterapia",
    "status": "cancelled",
    "requested_by": "Shane Evans",
    "required_by": "2024-12-22T16:51:19.753414",
    "created_at": "2024-11-29T16:51:19.753424",
    "id": 11
  },
  {
    "title": "Adquisición de lámparas quirúrgicas",
    "status": "pending",
    "requested_by": "Danielle Becker",
    "required_by": "2024-12-08T16:51:19.753718",
    "created_at": "2024-11-29T16:51:19.753729",
    "id": 12
  },
  {
    "title": "Solicitud de camillas de traslado",
    "status": "cancelled",
    "requested_by": "Jennifer Chambers",
    "required_by": "2024-12-12T16:51:19.753998",
    "created_at": "2024-11-29T16:51:19.754006",
    "id": 13
  },
  {
    "title": "Pedido de autoclave para esterilización",
    "status": "ordered",
    "requested_by": "David Castillo",
    "required_by": "2024-12-12T16:51:19.754293",
    "created_at": "2024-11-29T16:51:19.754303",
    "id": 14
  },
  {
    "title": "Compra de tensiómetros digitales",
    "status": "ordered",
    "requested_by": "Alex Jones",
    "required_by": "2024-12-24T16:51:19.754812",
    "created_at": "2024-11-29T16:51:19.754838",
    "id": 15
  },
  {
    "title": "Adquisición de medicamentos básicos",
    "status": "ordered",
    "requested_by": "Danielle Cabrera",
    "required_by": "2024-12-25T16:51:19.755140",
    "created_at": "2024-11-29T16:51:19.755151",
    "id": 16
  },
  {
    "title": "Renovación de mobiliario clínico",
    "status": "pending",
    "requested_by": "Judy Mercado",
    "required_by": "2024-12-10T16:51:19.755440",
    "created_at": "2024-11-29T16:51:19.755449",
    "id": 17
  },
  {
    "title": "Pedido de desfibriladores",
    "status": "cancelled",
    "requested_by": "Mallory Cherry",
    "required_by": "2024-12-15T16:51:19.755732",
    "created_at": "2024-11-29T16:51:19.755743",
    "id": 18
  },
  {
    "title": "Compra de bolsas para desechos biológicos",
    "status": "cancelled",
    "requested_by": "Roy Rodriguez",
    "required_by": "2024-12-28T16:51:19.756064",
    "created_at": "2024-11-29T16:51:19.756894",
    "id": 19
  },
  {
    "title": "Adquisición de insumos de laboratorio",
    "status": "cancelled",
    "requested_by": "Danielle Payne",
    "required_by": "2024-12-03T16:51:19.757388",
    "created_at": "2024-11-29T16:51:19.757403",
    "id": 20
  }
]

const PAGE_SIZE = 15

export function PurchaseRequestsTable() {
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
    <div className="flex flex-col h-full">
      <div className="flex items-center pb-4 justify-between">
        <div className="flex gap-4">
          <div className="flex gap-1">
            <Input
              placeholder="Buscar solicitud de compra..."
              value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="max-w-xs py-0 h-8 rounded-tr-none rounded-br-none"
            />
            <Button
              variant="outline"
              size="icon"
              className="min-w-8 h-8 rounded-tl-none rounded-bl-none"
            >
              <Search />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                Columnas <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {typeof column.columnDef.header === "string" && column.columnDef.header}
                      {typeof column.columnDef.header === "function" && column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          size="sm"
          asChild
        >
          <Link href="/purchases/purchase-requests/new">
            <Plus className="w-4 h-4" />
            Crear Solicitud
          </Link>
        </Button>
      </div>
      <div className="rounded-sm border h-[calc(100%-96px)]">
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
                  className={cn(table.getRowModel().rows.length === PAGE_SIZE && "last:!border-b-0")}
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
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 pt-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Mostrando {table.getRowModel().rows.length} de {table.getRowCount()} solicitudes.
        </div>
        <div className="space-x-2 flex items-center">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} de{" "}
              {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
            </div>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="w-8 h-8"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
