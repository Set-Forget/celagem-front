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
import { CalendarIcon, Check, ChevronLeft, ChevronRight, ListFilter, Plus, Search } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { addDays, format } from "date-fns"
import Link from "next/link"
import { DateRange } from "react-day-picker"
import { columns, Invoice } from "./columns"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const data: Invoice[] = [
  {
    "number": "INV-6505",
    "status": "overdue",
    "type": "FA",
    "issue_date": "2023-09-26",
    "due_date": "2023-11-21",
    "amount": 8421.71,
    "currency": "EUR",
    "description": "Devolución de productos",
    "company_name": "Alpha Solutions S.A."
  },
  {
    "number": "INV-9483",
    "status": "overdue",
    "type": "FA",
    "issue_date": "2023-12-25",
    "due_date": "2024-02-14",
    "amount": 747.02,
    "currency": "ARS",
    "description": "Compra de insumos",
    "company_name": "Beta Industries Corp."
  },
  {
    "number": "INV-1668",
    "status": "overdue",
    "type": "FA",
    "issue_date": "2023-12-21",
    "due_date": "2024-01-23",
    "amount": 2446.35,
    "currency": "USD",
    "description": "Compra de insumos",
    "company_name": "Gamma Enterprises Ltd."
  },
  {
    "number": "INV-1810",
    "status": "in_process",
    "type": "FA",
    "issue_date": "2023-03-13",
    "due_date": "2023-05-16",
    "amount": 7469.16,
    "currency": "ARS",
    "description": "Reembolso de gastos",
    "company_name": "Delta Logistics S.R.L."
  },
  {
    "number": "INV-7305",
    "status": "paid",
    "type": "FA",
    "issue_date": "2023-05-07",
    "due_date": "2023-07-17",
    "amount": 6518.74,
    "currency": "ARS",
    "description": "Servicios prestados",
    "company_name": "Epsilon Software LLC"
  },
  {
    "number": "INV-9266",
    "status": "pending",
    "type": "FA",
    "issue_date": "2023-10-31",
    "due_date": "2023-11-24",
    "amount": 7294.64,
    "currency": "ARS",
    "description": "Gastos administrativos",
    "company_name": "Zeta Holdings Inc."
  },
  {
    "number": "INV-7993",
    "status": "pending",
    "type": "FA",
    "issue_date": "2023-06-04",
    "due_date": "2023-07-14",
    "amount": 9059.42,
    "currency": "ARS",
    "description": "Gastos administrativos",
    "company_name": "Theta Manufacturing Co."
  },
  {
    "number": "INV-8151",
    "status": "paid",
    "type": "FA",
    "issue_date": "2023-06-26",
    "due_date": "2023-07-24",
    "amount": 5016.77,
    "currency": "EUR",
    "description": "Orden de compra de equipo",
    "company_name": "Omega Tech Group S.A."
  },
  {
    "number": "INV-5231",
    "status": "paid",
    "type": "FA",
    "issue_date": "2023-08-11",
    "due_date": "2023-09-03",
    "amount": 4333.29,
    "currency": "ARS",
    "description": "Venta de productos",
    "company_name": "Sigma Ventures LLC"
  },
  {
    "number": "INV-3151",
    "status": "in_process",
    "type": "FA",
    "issue_date": "2023-08-08",
    "due_date": "2023-11-06",
    "amount": 8015.32,
    "currency": "EUR",
    "description": "Facturación de proyecto",
    "company_name": "Lambda Consulting Ltd."
  },
  {
    "number": "INV-5189",
    "status": "paid",
    "type": "FA",
    "issue_date": "2023-09-04",
    "due_date": "2023-10-21",
    "amount": 8464.7,
    "currency": "ARS",
    "description": "Nota de crédito aplicada",
    "company_name": "Kappa Dynamics S.R.L."
  },
  {
    "number": "INV-1342",
    "status": "overdue",
    "type": "FA",
    "issue_date": "2023-09-27",
    "due_date": "2023-11-04",
    "amount": 2124.93,
    "currency": "ARS",
    "description": "Venta de productos",
    "company_name": "Iota Global Services Inc."
  },
  {
    "number": "INV-6617",
    "status": "pending",
    "type": "FA",
    "issue_date": "2023-03-13",
    "due_date": "2023-05-16",
    "amount": 6512.55,
    "currency": "ARS",
    "description": "Nota de crédito aplicada",
    "company_name": "Mu Retail Group S.A."
  },
  {
    "number": "INV-6929",
    "status": "paid",
    "type": "FA",
    "issue_date": "2023-03-23",
    "due_date": "2023-06-01",
    "amount": 8347.34,
    "currency": "EUR",
    "description": "Nota de crédito aplicada",
    "company_name": "Nu Energy Solutions Ltd."
  },
  {
    "number": "INV-5125",
    "status": "in_process",
    "type": "FA",
    "issue_date": "2023-11-13",
    "due_date": "2024-01-22",
    "amount": 1752.09,
    "currency": "ARS",
    "description": "Venta de productos",
    "company_name": "Xi Innovations LLC"
  },
  {
    "number": "INV-9769",
    "status": "overdue",
    "type": "FA",
    "issue_date": "2023-01-22",
    "due_date": "2023-04-18",
    "amount": 9485.95,
    "currency": "EUR",
    "description": "Nota de débito generada",
    "company_name": "Omicron Systems Corp."
  },
  {
    "number": "INV-7980",
    "status": "in_process",
    "type": "FA",
    "issue_date": "2023-10-17",
    "due_date": "2023-11-26",
    "amount": 288.91,
    "currency": "EUR",
    "description": "Nota de crédito aplicada",
    "company_name": "Pi Engineering Co."
  },
  {
    "number": "INV-1829",
    "status": "pending",
    "type": "FA",
    "issue_date": "2023-06-27",
    "due_date": "2023-08-17",
    "amount": 3963.94,
    "currency": "USD",
    "description": "Nota de débito generada",
    "company_name": "Rho Digital Agency S.A."
  },
  {
    "number": "INV-5287",
    "status": "in_process",
    "type": "FA",
    "issue_date": "2023-06-16",
    "due_date": "2023-07-01",
    "amount": 7223.78,
    "currency": "ARS",
    "description": "Nota de crédito aplicada",
    "company_name": "Tau Analytics Group Ltd."
  },
  {
    "number": "INV-5507",
    "status": "pending",
    "type": "FA",
    "issue_date": "2023-10-06",
    "due_date": "2023-11-04",
    "amount": 8848.93,
    "currency": "ARS",
    "description": "Devolución de productos",
    "company_name": "Upsilon Health Tech LLC"
  }
]

const options = [
  { label: "Paga", value: "paid" },
  { label: "Vencida", value: "overdue" },
  { label: "Pendiente", value: "pending" },
]

const PAGE_SIZE = 15

export function BillsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 365),
  })

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

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const facets = table.getColumn("status")?.getFacetedUniqueValues()
  const selectedValues = new Set(table.getColumn("status")?.getFilterValue() as string[])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center pb-4 justify-between">
        <div className="flex gap-4">
          <div className="flex gap-1">
            <Input
              placeholder="Buscar facturas..."
              value={(table.getColumn("number")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("number")?.setFilterValue(event.target.value)
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                size="sm"
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Seleccioná un rango</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <ListFilter className="ml-auto h-4 w-4" />
                Estado
                {selectedValues?.size > 0 && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal lg:hidden"
                    >
                      {selectedValues.size}
                    </Badge>
                    <div className="hidden space-x-1 lg:flex">
                      {selectedValues.size > 2 ? (
                        <Badge
                          variant="secondary"
                          className="rounded-sm px-1 font-normal"
                        >
                          {selectedValues.size} selected
                        </Badge>
                      ) : (
                        options
                          .filter((option) => selectedValues.has(option.value))
                          .map((option) => (
                            <Badge
                              variant="secondary"
                              key={option.value}
                              className="rounded-sm px-1 font-normal"
                            >
                              {option.label}
                            </Badge>
                          ))
                      )}
                    </div>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Estado" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => {
                      const isSelected = selectedValues.has(option.value)
                      return (
                        <CommandItem
                          key={option.value}
                          onSelect={() => {
                            if (isSelected) {
                              selectedValues.delete(option.value)
                            } else {
                              selectedValues.add(option.value)
                            }
                            const filterValues = Array.from(selectedValues)
                            table.getColumn("status")?.setFilterValue(
                              filterValues.length ? filterValues : undefined
                            )
                          }}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <Check />
                          </div>
                          <span>{option.label}</span>
                          {facets?.get(option.value) && (
                            <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                              {facets.get(option.value)}
                            </span>
                          )}
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                  {selectedValues.size > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => table.getColumn("status")?.setFilterValue(undefined)}
                          className="justify-center text-center text-xs"
                        >
                          Limpiar filtro
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex gap-4">
          {selectedRows.length > 0 && (
            <Button
              className="ml-auto"
              size="sm"
              variant="ghost"
              asChild
            >
              <Link href="/banking/payments/new">
                Registrar pagos
              </Link>
            </Button>
          )}
          <Button
            size="sm"
            asChild
          >
            <Link href="/purchases/bills/new">
              <Plus className="w-4 h-4" />
              Cargar Factura
            </Link>
          </Button>
        </div>
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
                  className={cn(table.getRowModel().rows.length !== PAGE_SIZE && "!border-b")}
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
          Mostrando {table.getRowModel().rows.length} de {table.getRowCount()} facturas.
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
