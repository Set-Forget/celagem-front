'use client'

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Column,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import { ArrowLeftToLineIcon, ArrowRightToLineIcon, EllipsisIcon, PinOffIcon } from "lucide-react";
import { CSSProperties, useMemo, useState } from "react";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";
import { AccountsPayableAndReceivableList } from "./schemas/accounts-payable-and-receivable";
import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    forceFooterPosition?: number;
  }
}

const data = [
  {
    "id": 49,
    "date": "2024-03-29T00:00:00",
    "customer": "Tecnología Avanzada S.R.L.",
    "accounting_account": "Proveedores",
    "costs_center": "Sucursal Córdoba",
    "voucher_type": "Nota de Crédito",
    "voucher_number": "8544-58271849",
    "due_date": "2024-10-26T00:00:00",
    "invoiced_amount": 26442.96,
    "paid_amount": 13637.54,
    "outstanding_amount": 12805.419999999998,
    "currency": "ARS",
    "30_days": 0,
    "60_days": 0,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  },
  {
    "id": 50,
    "date": "2024-02-11T00:00:00",
    "customer": "Distribuidora Buenos Aires",
    "accounting_account": "Gastos Administrativos",
    "costs_center": "Sucursal Córdoba",
    "voucher_type": "Nota de Crédito",
    "voucher_number": "3416-32901613",
    "due_date": "2024-11-25T00:00:00",
    "invoiced_amount": 160921.85,
    "paid_amount": 132362.82,
    "outstanding_amount": 28559.03,
    "currency": "EUR",
    "30_days": 0,
    "60_days": 0,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  },
  {
    "id": 51,
    "date": "2024-11-02T00:00:00",
    "customer": "Servicios Eléctricos S.A.",
    "accounting_account": "Bancos",
    "costs_center": "Sucursal Rosario",
    "voucher_type": "Recibo",
    "voucher_number": "6492-89645890",
    "due_date": "2024-12-09T00:00:00",
    "invoiced_amount": 56430.87,
    "paid_amount": 54390.56,
    "outstanding_amount": 2040.310000000005,
    "currency": "USD",
    "30_days": 612.09,
    "60_days": 0,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  },
  {
    "id": 71,
    "date": "2024-05-02T00:00:00",
    "customer": "Servicios Eléctricos S.A.",
    "accounting_account": "Gastos Administrativos",
    "costs_center": "Planta de Producción",
    "voucher_type": "Nota de Crédito",
    "voucher_number": "8144-46715121",
    "due_date": "2024-12-10T00:00:00",
    "invoiced_amount": 39995.89,
    "paid_amount": 38701.87,
    "outstanding_amount": 1294.0199999999968,
    "currency": "USD",
    "30_days": 0,
    "60_days": 0,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  },
  {
    "id": 72,
    "date": "2024-08-18T00:00:00",
    "customer": "Materiales Industriales Mendoza",
    "accounting_account": "Proveedores",
    "costs_center": "Planta de Producción",
    "voucher_type": "Nota de Débito",
    "voucher_number": "1288-41565336",
    "due_date": "2024-08-19T00:00:00",
    "invoiced_amount": 102588.79,
    "paid_amount": 28461.09,
    "outstanding_amount": 74127.7,
    "currency": "EUR",
    "30_days": 22238.31,
    "60_days": 0,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  },
  {
    "id": 73,
    "date": "2024-11-08T00:00:00",
    "customer": "Materiales Industriales Mendoza",
    "accounting_account": "Clientes",
    "costs_center": "Sucursal Córdoba",
    "voucher_type": "Nota de Crédito",
    "voucher_number": "8924-39687561",
    "due_date": "2024-12-12T00:00:00",
    "invoiced_amount": 162262.79,
    "paid_amount": 14873.8,
    "outstanding_amount": 147388.99000000002,
    "currency": "ARS",
    "30_days": 0,
    "60_days": 0,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  },
  {
    "id": 74,
    "date": "2024-08-15T00:00:00",
    "customer": "Materiales Industriales Mendoza",
    "accounting_account": "Gastos Administrativos",
    "costs_center": "Departamento IT",
    "voucher_type": "Nota de Crédito",
    "voucher_number": "7270-52513024",
    "due_date": "2024-12-08T00:00:00",
    "invoiced_amount": 11625.31,
    "paid_amount": 11549.59,
    "outstanding_amount": 75.71999999999935,
    "currency": "EUR",
    "30_days": 0,
    "60_days": 0,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  },
  {
    "id": 75,
    "date": "2024-03-08T00:00:00",
    "customer": "Materiales Industriales Mendoza",
    "accounting_account": "Clientes",
    "costs_center": "Planta de Producción",
    "voucher_type": "Factura B",
    "voucher_number": "9602-23759431",
    "due_date": "2024-12-02T00:00:00",
    "invoiced_amount": 11559.41,
    "paid_amount": 2126.63,
    "outstanding_amount": 9432.779999999999,
    "currency": "USD",
    "30_days": 2829.83,
    "60_days": 1886.56,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  },
  {
    "id": 76,
    "date": "2024-01-07T00:00:00",
    "customer": "Materiales Industriales Mendoza",
    "accounting_account": "Bancos",
    "costs_center": "Sucursal Córdoba",
    "voucher_type": "Recibo",
    "voucher_number": "5501-60711674",
    "due_date": "2024-04-02T00:00:00",
    "invoiced_amount": 63571.27,
    "paid_amount": 10231.34,
    "outstanding_amount": 53339.92999999999,
    "currency": "EUR",
    "30_days": 16001.98,
    "60_days": 10667.99,
    "90_days": 10667.99,
    "120_days": 8000.99,
    "120+_days": 8000.99
  },
  {
    "id": 77,
    "date": "2024-11-19T00:00:00",
    "customer": "Distribuidora Buenos Aires",
    "accounting_account": "Gastos Administrativos",
    "costs_center": "Departamento IT",
    "voucher_type": "Factura B",
    "voucher_number": "1979-64774478",
    "due_date": "2024-10-24T00:00:00",
    "invoiced_amount": 142807.29,
    "paid_amount": 135344.85,
    "outstanding_amount": 7462.440000000002,
    "currency": "ARS",
    "30_days": 2238.73,
    "60_days": 0,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  },
  {
    "id": 78,
    "date": "2024-05-10T00:00:00",
    "customer": "Materiales Industriales Mendoza",
    "accounting_account": "Caja General",
    "costs_center": "Sucursal Córdoba",
    "voucher_type": "Factura A",
    "voucher_number": "1803-54170374",
    "due_date": "2024-09-20T00:00:00",
    "invoiced_amount": 173965.96,
    "paid_amount": 50646.61,
    "outstanding_amount": 123319.34999999999,
    "currency": "EUR",
    "30_days": 36995.8,
    "60_days": 24663.87,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  },
  {
    "id": 79,
    "date": "2024-01-05T00:00:00",
    "customer": "Importadora Patagónica",
    "accounting_account": "Gastos Administrativos",
    "costs_center": "Sucursal Córdoba",
    "voucher_type": "Nota de Crédito",
    "voucher_number": "1614-67777969",
    "due_date": "2024-08-27T00:00:00",
    "invoiced_amount": 121225.12,
    "paid_amount": 57254.02,
    "outstanding_amount": 63971.1,
    "currency": "USD",
    "30_days": 0,
    "60_days": 0,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  },
  {
    "id": 80,
    "date": "2024-05-14T00:00:00",
    "customer": "Tecnología Avanzada S.R.L.",
    "accounting_account": "Caja General",
    "costs_center": "Sucursal Rosario",
    "voucher_type": "Factura B",
    "voucher_number": "4774-41584143",
    "due_date": "2024-10-24T00:00:00",
    "invoiced_amount": 113877.55,
    "paid_amount": 26582.98,
    "outstanding_amount": 87294.57,
    "currency": "EUR",
    "30_days": 26188.37,
    "60_days": 0,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  },
  {
    "id": 81,
    "date": "2024-07-27T00:00:00",
    "customer": "Distribuidora Buenos Aires",
    "accounting_account": "Gastos Administrativos",
    "costs_center": "Oficina Central",
    "voucher_type": "Factura B",
    "voucher_number": "8102-71565801",
    "due_date": "2024-10-27T00:00:00",
    "invoiced_amount": 6159.48,
    "paid_amount": 3580.13,
    "outstanding_amount": 2579.3499999999995,
    "currency": "ARS",
    "30_days": 773.8,
    "60_days": 0,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  },
  {
    "id": 95,
    "date": "2024-03-08T00:00:00",
    "customer": "Servicios Eléctricos S.A.",
    "accounting_account": "Caja General",
    "costs_center": "Oficina Central",
    "voucher_type": "Factura B",
    "voucher_number": "6934-13124740",
    "due_date": "2024-08-02T00:00:00",
    "invoiced_amount": 143022.34,
    "paid_amount": 123231.8,
    "outstanding_amount": 19790.539999999994,
    "currency": "ARS",
    "30_days": 5937.16,
    "60_days": 0,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  },
  {
    "id": 96,
    "date": "2024-02-27T00:00:00",
    "customer": "Tecnología Avanzada S.R.L.",
    "accounting_account": "Clientes",
    "costs_center": "Planta de Producción",
    "voucher_type": "Recibo",
    "voucher_number": "4262-94019704",
    "due_date": "2024-01-26T00:00:00",
    "invoiced_amount": 98196.07,
    "paid_amount": 27632.92,
    "outstanding_amount": 70563.15000000001,
    "currency": "USD",
    "30_days": 0,
    "60_days": 0,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  },
  {
    "id": 97,
    "date": "2024-03-19T00:00:00",
    "customer": "Importadora Patagónica",
    "accounting_account": "Proveedores",
    "costs_center": "Departamento IT",
    "voucher_type": "Factura A",
    "voucher_number": "4561-17010988",
    "due_date": "2024-04-18T00:00:00",
    "invoiced_amount": 25363.52,
    "paid_amount": 15954.9,
    "outstanding_amount": 9408.62,
    "currency": "EUR",
    "30_days": 0,
    "60_days": 0,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  },
  {
    "id": 98,
    "date": "2024-09-01T00:00:00",
    "customer": "Servicios Eléctricos S.A.",
    "accounting_account": "Clientes",
    "costs_center": "Departamento IT",
    "voucher_type": "Recibo",
    "voucher_number": "4555-39870878",
    "due_date": "2024-12-18T00:00:00",
    "invoiced_amount": 124333.74,
    "paid_amount": 24708.16,
    "outstanding_amount": 99625.58,
    "currency": "EUR",
    "30_days": 29887.67,
    "60_days": 19925.12,
    "90_days": 19925.12,
    "120_days": 14943.84,
    "120+_days": 14943.84
  },
  {
    "id": 99,
    "date": "2024-12-29T00:00:00",
    "customer": "Distribuidora Buenos Aires",
    "accounting_account": "Clientes",
    "costs_center": "Oficina Central",
    "voucher_type": "Nota de Crédito",
    "voucher_number": "6449-67773009",
    "due_date": "2024-10-31T00:00:00",
    "invoiced_amount": 19820.23,
    "paid_amount": 19700.69,
    "outstanding_amount": 119.54000000000087,
    "currency": "USD",
    "30_days": 0,
    "60_days": 0,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  },
  {
    "id": 100,
    "date": "2024-08-16T00:00:00",
    "customer": "Importadora Patagónica",
    "accounting_account": "Proveedores",
    "costs_center": "Sucursal Rosario",
    "voucher_type": "Factura A",
    "voucher_number": "5258-69909232",
    "due_date": "2024-04-16T00:00:00",
    "invoiced_amount": 65776.57,
    "paid_amount": 55357.9,
    "outstanding_amount": 10418.670000000006,
    "currency": "ARS",
    "30_days": 3125.6,
    "60_days": 0,
    "90_days": 0,
    "120_days": 0,
    "120+_days": 0
  }
]

function groupByCustomer(accounts: AccountsReceivableList[]): AccountsReceivableList[] {
  const groups: { [customer: string]: AccountsReceivableList[] } = {};
  accounts.forEach((item) => {
    const customer = item.customer;
    if (!groups[customer]) {
      groups[customer] = [];
    }
    groups[customer].push(item);
  });

  const result: AccountsReceivableList[] = [];
  Object.keys(groups).forEach((customer) => {
    const items = groups[customer];

    items.forEach((item) => result.push(item));

    const totalInvoiced = items.reduce((sum, item) => sum + Number(item.invoiced_amount), 0);
    const totalPaid = items.reduce((sum, item) => sum + Number(item.paid_amount), 0);
    const totalOutstanding = items.reduce((sum, item) => sum + Number(item.outstanding_amount), 0);
    const total30Days = items.reduce((sum, item) => sum + Number(item["30_days"]), 0);
    const total60Days = items.reduce((sum, item) => sum + Number(item["60_days"]), 0);
    const total90Days = items.reduce((sum, item) => sum + Number(item["90_days"]), 0);
    const total120Days = items.reduce((sum, item) => sum + Number(item["120_days"]), 0);
    const total120PlusDays = items.reduce((sum, item) => sum + Number(item["120+_days"]), 0);

    const totalRow: AccountsReceivableList = {
      id: -1,
      date: "",
      customer,
      accounting_account: "",
      costs_center: "",
      voucher_type: "",
      voucher_number: "",
      due_date: "",
      invoiced_amount: parseFloat(totalInvoiced.toFixed(2)),
      paid_amount: parseFloat(totalPaid.toFixed(2)),
      outstanding_amount: parseFloat(totalOutstanding.toFixed(2)),
      currency: items[0].currency,
      "30_days": parseFloat(total30Days.toFixed(2)),
      "60_days": parseFloat(total60Days.toFixed(2)),
      "90_days": parseFloat(total90Days.toFixed(2)),
      "120_days": parseFloat(total120Days.toFixed(2)),
      "120+_days": parseFloat(total120PlusDays.toFixed(2)),
    };

    result.push(totalRow);

    const emptyRow: AccountsReceivableList = {
      id: -2,
      date: "",
      customer: "",
      accounting_account: "",
      costs_center: "",
      voucher_type: "",
      voucher_number: "",
      due_date: "",
      invoiced_amount: null,
      paid_amount: null,
      outstanding_amount: null,
      currency: "",
      "30_days": null,
      "60_days": null,
      "90_days": null,
      "120_days": null,
      "120+_days": null,
    };

    result.push(emptyRow);
  });

  return result;
}

export default function AccountsReceivablePage() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const memoizedData = useMemo(() => groupByCustomer(data), [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    enableSortingRemoval: false,
  });

  const getPinningStyles = (column: Column<AccountsReceivableList>): CSSProperties => {
    const isPinned = column.getIsPinned();
    return {
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      position: isPinned ? "sticky" : "relative",
      width: column.getSize(),
      zIndex: isPinned ? 1 : 0,
    };
  };

  return (
    <>
      <Header title="Cuentas por cobrar" />
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-213px)] [&_*[data-table='true']]:w-[calc(100svw-306px)]">
        <div className="space-y-4 flex flex-col justify-between">
          <Toolbar table={table} />
          <div className="overflow-hidden rounded-sm border border-border bg-background shadow-sm">
            <Table
              className="[&_td]:border-border [&_th]:border-border table-fixed border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b"
              style={{
                width: table.getTotalSize(),
              }}
            >
              <TableHeader className="sticky top-0 z-10 bg-accent/90 backdrop-blur-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-muted/50">
                    {headerGroup.headers.map((header) => {
                      const { column } = header;
                      const isPinned = column.getIsPinned();
                      const isLastLeftPinned = isPinned === "left" && column.getIsLastColumn("left");
                      const isFirstRightPinned = isPinned === "right" && column.getIsFirstColumn("right");

                      return (
                        <TableHead
                          key={header.id}
                          className="[&[data-pinned][data-last-col]]:border-border [&[data-pinned]]:bg-muted/90 relative h-10 truncate [&[data-pinned]]:backdrop-blur-sm [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-l"
                          colSpan={header.colSpan}
                          style={{ ...getPinningStyles(column) }}
                          data-pinned={isPinned || undefined}
                          data-last-col={
                            isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
                          }
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate">
                              {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                            {!header.isPlaceholder &&
                              header.column.getCanPin() &&
                              (header.column.getIsPinned() ? (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="-mr-1 size-7 shadow-none"
                                  onClick={() => header.column.pin(false)}
                                  aria-label={`Unpin ${header.column.columnDef.header as string} column`}
                                  title={`Unpin ${header.column.columnDef.header as string} column`}
                                >
                                  <PinOffIcon className="opacity-60" size={16} aria-hidden="true" />
                                </Button>
                              ) : (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="-mr-1 size-7 shadow-none"
                                      aria-label={`Pin options for ${header.column.columnDef.header as string} column`}
                                      title={`Pin options for ${header.column.columnDef.header as string} column`}
                                    >
                                      <EllipsisIcon className="opacity-60" size={16} aria-hidden="true" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => header.column.pin("left")}>
                                      <ArrowLeftToLineIcon
                                        size={16}
                                        className="opacity-60"
                                        aria-hidden="true"
                                      />
                                      Fijar a la izquierda
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => header.column.pin("right")}>
                                      <ArrowRightToLineIcon
                                        size={16}
                                        className="opacity-60"
                                        aria-hidden="true"
                                      />
                                      Fijar a la derecha
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              ))}
                            {header.column.getCanResize() && (
                              <div
                                {...{
                                  onDoubleClick: () => header.column.resetSize(),
                                  onMouseDown: header.getResizeHandler(),
                                  className:
                                    "absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:-translate-x-px",
                                }}
                              />
                            )}
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => {
                        const { column, row } = cell;
                        const isPinned = column.getIsPinned();
                        const isLastLeftPinned = isPinned === "left" && column.getIsLastColumn("left");
                        const isFirstRightPinned = isPinned === "right" && column.getIsFirstColumn("right");

                        return (
                          <TableCell
                            key={cell.id}
                            className={cn("[&[data-pinned][data-last-col]]:border-border [&[data-pinned]]:bg-background/90 truncate [&[data-pinned]]:backdrop-blur-sm [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l", row.original.id === -1 && "bg-accent")}
                            style={{ ...getPinningStyles(column) }}
                            data-pinned={isPinned || undefined}
                            data-last-col={
                              isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
                            }
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter className="sticky bottom-0 z-10 bg-accent/90 backdrop-blur-sm">
                {table.getFooterGroups().map((footerGroup) => (
                  <TableRow key={footerGroup.id}>
                    {footerGroup.headers.map((header) => {
                      const { column } = header;
                      const isPinned = column.getIsPinned();
                      const isLastLeftPinned = isPinned === "left" && column.getIsLastColumn("left");
                      const isFirstRightPinned = isPinned === "right" && column.getIsFirstColumn("right");
                      return (
                        <TableCell
                          key={header.id}
                          style={{ ...getPinningStyles(column) }}
                          data-pinned={isPinned || undefined}
                          data-last-col={
                            isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
                          }
                          className="[&[data-pinned][data-last-col]]:border-border [&[data-pinned]]:bg-accent/90 [&[data-pinned]]:backdrop-blur-sm [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.footer, header.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableFooter>

            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <div className="flex grow justify-start whitespace-nowrap text-sm text-muted-foreground">
              <p className="whitespace-nowrap text-sm text-muted-foreground" aria-live="polite">
                Mostrando{" "}
                <span className="text-foreground">
                  {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                  {Math.min(
                    Math.max(
                      table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                      table.getState().pagination.pageSize,
                      0,
                    ),
                    table.getRowCount(),
                  )}
                </span>{" "}
                de{" "}<span className="text-foreground">{table.getRowCount().toString()}</span>
                {" "}resultados
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}