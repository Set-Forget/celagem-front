'use client'

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { GeneralLedgerItemsTable } from "./components/general-ledger-items-table"
import { exportExcel } from "@/lib/xlsx"
import { JournalEntryItem } from "../../../journal-entries/schemas/journal-entries"
import { generatePDF } from "@/lib/html2pdf"

export default function GeneralLedgerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 365),
  })
  //const customerId = (await params).id

  const data: JournalEntryItem[] = [
    {
      "date": "2024-02-14",
      "account": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
      "debit": 2500.45,
      "credit": 0,
      "balance": 8200.55,
      "cost_center": "Operaciones"
    },
    {
      "date": "2023-12-05",
      "account": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
      "debit": 0,
      "credit": 1800.00,
      "balance": 6400.55,
      "cost_center": "Administración"
    },
    {
      "date": "2024-01-10",
      "account": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
      "debit": 3200.00,
      "credit": 0,
      "balance": 9600.55,
      "cost_center": "Ventas"
    },
    {
      "date": "2023-11-25",
      "account": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
      "debit": 0,
      "credit": 1200.00,
      "balance": 8400.55,
      "cost_center": "Producción"
    },
    {
      "date": "2024-03-12",
      "account": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
      "debit": 1000.00,
      "credit": 0,
      "balance": 9400.55,
      "cost_center": "Operaciones"
    },
    {
      "date": "2024-02-20",
      "account": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
      "debit": 0,
      "credit": 1500.00,
      "balance": 7900.55,
      "cost_center": "Administración"
    },
    {
      "date": "2024-01-18",
      "account": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
      "debit": 500.00,
      "credit": 0,
      "balance": 8400.55,
      "cost_center": "Ventas"
    },
    {
      "date": "2023-12-30",
      "account": "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
      "debit": 0,
      "credit": 300.00,
      "balance": 8100.55,
      "cost_center": "Producción"
    }
  ]

  return (
    <>
      <div id="balance-general">
        <Header title="EFECTIVO Y EQUIVALENTES AL EFECTIVO">
          <div className={cn('flex gap-2 ml-auto')}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(
                    'justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y')} -{' '}
                        {format(date.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Seleccioná un rango</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
              >
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
            <Button
              data-html2canvas-ignore
              onClick={() =>
                exportExcel(
                  data,
                  `Balance General - (${format(
                    date?.from || new Date(),
                    'LLL dd, y'
                  )} - ${format(date?.to || new Date(), 'LLL dd, y')})`
                )
              }
            >
              Exportar a Excel
            </Button>
            <Button
              data-html2canvas-ignore
              onClick={() =>
                generatePDF(
                  document.getElementById('balance-general')!,
                  `Balance General - (${format(
                    date?.from || new Date(),
                    'LLL dd, y'
                  )} - ${format(date?.to || new Date(), 'LLL dd, y')}).pdf`
                )
              }
            >
              Exportar a PDF
            </Button>
          </div>
        </Header>
        <Separator />
        <div className="flex flex-col gap-4 py-4 flex-1">
          <div className="px-4 flex flex-col gap-4">
            <h2 className="text-base font-medium">General</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">
                  Fecha de creación
                </label>
                <span className="text-sm">12 de febrero de 2022</span>
              </div>
            </div>
          </div>
          <Separator />
          <div className="px-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium">Items</h2>
            </div>
            <GeneralLedgerItemsTable />
          </div>
        </div>
      </div>
    </>
  );
}
