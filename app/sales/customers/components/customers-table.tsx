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
import { Customer } from "../schemas/customers"
import { columns } from "./columns"

const data: Customer[] = [
  {
    company_name: "NextGen Enterprises",
    type: "company",
    address: "253 Maple Rd, Boston, USA",
    cuit: "24-53797682-6"
  },
  {
    company_name: "Prime Enterprises",
    type: "company",
    address: "2644 Willow Rd, Austin, USA",
    cuit: "21-27733173-2"
  },
  {
    company_name: "NextGen Group",
    type: "natural_person",
    address: "3206 Pine Rd, Boston, USA",
    cuit: "27-96025975-1"
  },
  {
    company_name: "NextGen Services",
    type: "company",
    address: "3543 Willow St, Seattle, USA",
    cuit: "32-52636165-8"
  },
  {
    company_name: "NextGen Services",
    type: "natural_person",
    address: "5086 Birch Ave, Boston, USA",
    cuit: "31-63897598-7"
  },
  {
    company_name: "Green Solutions",
    type: "company",
    address: "987 Oak Ave, Denver, USA",
    cuit: "20-78452169-4"
  },
  {
    company_name: "Tech Group",
    type: "natural_person",
    address: "134 Cedar Blvd, New York, USA",
    cuit: "27-49328761-0"
  },
  {
    company_name: "Global Corporation",
    type: "company",
    address: "776 Birch St, San Francisco, USA",
    cuit: "33-78129465-3"
  },
  {
    company_name: "Blue Industries",
    type: "company",
    address: "539 Maple Ave, Austin, USA",
    cuit: "24-52836792-5"
  },
  {
    company_name: "Silver Services",
    type: "natural_person",
    address: "842 Willow Lane, Chicago, USA",
    cuit: "31-98376512-2"
  },
  {
    company_name: "Green Industries",
    type: "natural_person",
    address: "612 Elm St, Boston, USA",
    cuit: "20-28759361-8"
  },
  {
    company_name: "Prime Corporation",
    type: "company",
    address: "938 Oak Lane, San Francisco, USA",
    cuit: "22-43976125-7"
  },
  {
    company_name: "Tech Solutions",
    type: "company",
    address: "365 Cedar Blvd, Seattle, USA",
    cuit: "23-81739425-9"
  },
  {
    company_name: "Silver Group",
    type: "natural_person",
    address: "211 Willow Ave, Denver, USA",
    cuit: "32-53761982-0"
  },
  {
    company_name: "Global Services",
    type: "natural_person",
    address: "582 Birch St, Austin, USA",
    cuit: "21-28637159-1"
  },
  {
    company_name: "Green Group",
    type: "company",
    address: "430 Maple Rd, Chicago, USA",
    cuit: "33-95183746-4"
  },
  {
    company_name: "NextGen Solutions",
    type: "natural_person",
    address: "103 Pine Blvd, Boston, USA",
    cuit: "25-67291384-6"
  },
  {
    company_name: "Blue Services",
    type: "company",
    address: "651 Elm Ave, Seattle, USA",
    cuit: "22-83419257-3"
  },
  {
    company_name: "Prime Solutions",
    type: "natural_person",
    address: "789 Willow Lane, New York, USA",
    cuit: "23-94871632-5"
  },
  {
    company_name: "Green Corporation",
    type: "company",
    address: "890 Birch Blvd, Denver, USA",
    cuit: "21-73918564-7"
  },
  {
    company_name: "NextGen Corporation",
    type: "natural_person",
    address: "912 Oak St, San Francisco, USA",
    cuit: "25-38196472-9"
  },
  {
    company_name: "Silver Enterprises",
    type: "company",
    address: "732 Cedar Rd, Boston, USA",
    cuit: "33-24981576-6"
  },
  {
    company_name: "Prime Group",
    type: "company",
    address: "639 Elm Blvd, Austin, USA",
    cuit: "21-85739462-8"
  },
  {
    company_name: "Blue Corporation",
    type: "natural_person",
    address: "359 Willow St, Denver, USA",
    cuit: "27-58139642-1"
  },
  {
    company_name: "Tech Enterprises",
    type: "company",
    address: "147 Birch Lane, Chicago, USA",
    cuit: "32-29571683-7"
  },
  {
    company_name: "Global Industries",
    type: "natural_person",
    address: "251 Pine Rd, New York, USA",
    cuit: "20-81739562-4"
  },
  {
    company_name: "Green Enterprises",
    type: "company",
    address: "385 Maple Blvd, Austin, USA",
    cuit: "21-38571629-3"
  },
  {
    company_name: "Silver Solutions",
    type: "natural_person",
    address: "461 Oak Lane, San Francisco, USA",
    cuit: "25-93716482-9"
  },
  {
    company_name: "Tech Services",
    type: "company",
    address: "273 Willow Rd, Denver, USA",
    cuit: "24-69173582-5"
  },
  {
    company_name: "Blue Group",
    type: "natural_person",
    address: "185 Cedar Blvd, Seattle, USA",
    cuit: "31-84723961-0"
  }
];

const PAGE_SIZE = 15

export function CustomersTable() {
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
              placeholder="Buscar cliente..."
              value={(table.getColumn("company_name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("company_name")?.setFilterValue(event.target.value)
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
        >
          <Plus className="w-4 h-4" />
          Crear Cliente
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
          Mostrando {table.getRowModel().rows.length} de {table.getRowCount()} clientes.
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
