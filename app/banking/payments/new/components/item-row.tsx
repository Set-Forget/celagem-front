import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TableCell,
  TableRow
} from "@/components/ui/table"
import { Check, ChevronsUpDown, Trash2 } from "lucide-react"
import { useFormContext, useWatch } from "react-hook-form"
import { z } from "zod"
import { newPaymentSchema } from "../../schemas/payments"
import { Badge } from "@/components/ui/badge"
import { INVOICE_STATUSES } from "@/app/purchases/bills/adapters/invoices"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Separator } from "@/components/ui/separator"
import { Fragment } from "react"

const bills = [
  {
    "id": "0004-000000345",
    "provider": "PROV-1",
    "status": "paid",
    "invoice_number": "INV-001",
    "invoice_date": "2022-01-14",
    "due_date": "2022-03-08",
    "amount": "",
    "balance": 1054,
    "currency": "ARS"
  },
  {
    "id": "0004-000000346",
    "provider": "PROV-2",
    "status": "paid",
    "invoice_number": "INV-002",
    "invoice_date": "2022-08-09",
    "due_date": "2022-09-04",
    "amount": "",
    "balance": 4425,
    "currency": "ARS"
  },
  {
    "id": "0004-000000347",
    "provider": "PROV-3",
    "status": "overdue",
    "invoice_number": "INV-003",
    "invoice_date": "2022-08-17",
    "due_date": "2022-10-04",
    "amount": "",
    "balance": 1052,
    "currency": "ARS"
  },
  {
    "id": "0004-000000348",
    "provider": "PROV-3",
    "status": "paid",
    "invoice_number": "INV-004",
    "invoice_date": "2022-10-30",
    "due_date": "2022-11-28",
    "amount": "",
    "balance": 2548,
    "currency": "ARS"
  },
  {
    "id": "0004-000000349",
    "provider": "PROV-4",
    "status": "pending",
    "invoice_number": "INV-005",
    "invoice_date": "2022-01-31",
    "due_date": "2022-03-08",
    "amount": "",
    "balance": 1605,
    "currency": "ARS"
  },
  {
    "id": "0004-000000350",
    "provider": "PROV-3",
    "status": "overdue",
    "invoice_number": "INV-006",
    "invoice_date": "2022-07-06",
    "due_date": "2022-08-26",
    "amount": "",
    "balance": 2561,
    "currency": "ARS"
  },
  {
    "id": "0004-000000351",
    "provider": "PROV-4",
    "status": "overdue",
    "invoice_number": "INV-007",
    "invoice_date": "2022-12-22",
    "due_date": "2023-01-26",
    "amount": "",
    "balance": 4163,
    "currency": "ARS"
  },
  {
    "id": "0004-000000352",
    "provider": "PROV-4",
    "status": "paid",
    "invoice_number": "INV-008",
    "invoice_date": "2022-12-22",
    "due_date": "2023-02-19",
    "amount": "",
    "balance": 1063,
    "currency": "ARS"
  },
  {
    "id": "0004-000000353",
    "provider": "PROV-3",
    "status": "paid",
    "invoice_number": "INV-009",
    "invoice_date": "2022-12-22",
    "due_date": "2023-01-11",
    "amount": "",
    "balance": 3595,
    "currency": "ARS"
  },
  {
    "id": "0004-000000354",
    "provider": "PROV-5",
    "status": "overdue",
    "invoice_number": "INV-010",
    "invoice_date": "2022-03-10",
    "due_date": "2022-04-08",
    "amount": "",
    "balance": 4779,
    "currency": "ARS"
  },
  {
    "id": "0004-000000355",
    "provider": "PROV-2",
    "status": "overdue",
    "invoice_number": "INV-011",
    "invoice_date": "2022-03-18",
    "due_date": "2022-04-19",
    "amount": "",
    "balance": 4920,
    "currency": "ARS"
  },
  {
    "id": "0004-000000356",
    "provider": "PROV-1",
    "status": "overdue",
    "invoice_number": "INV-012",
    "invoice_date": "2022-07-25",
    "due_date": "2022-08-20",
    "amount": "",
    "balance": 1848,
    "currency": "ARS"
  },
  {
    "id": "0004-000000357",
    "provider": "PROV-3",
    "status": "paid",
    "invoice_number": "INV-013",
    "invoice_date": "2022-09-29",
    "due_date": "2022-11-11",
    "amount": "",
    "balance": 663,
    "currency": "ARS"
  },
  {
    "id": "0004-000000358",
    "provider": "PROV-3",
    "status": "overdue",
    "invoice_number": "INV-014",
    "invoice_date": "2022-08-30",
    "due_date": "2022-10-16",
    "amount": "",
    "balance": 4762,
    "currency": "ARS"
  },
  {
    "id": "0004-000000359",
    "provider": "PROV-6",
    "status": "pending",
    "invoice_number": "INV-015",
    "invoice_date": "2022-04-22",
    "due_date": "2022-06-03",
    "amount": "",
    "balance": 2243,
    "currency": "ARS"
  },
  {
    "id": "0004-000000360",
    "provider": "PROV-3",
    "status": "overdue",
    "invoice_number": "INV-016",
    "invoice_date": "2022-12-22",
    "due_date": "2023-01-21",
    "amount": "",
    "balance": 4250,
    "currency": "ARS"
  },
  {
    "id": "0004-000000361",
    "provider": "PROV-7",
    "status": "pending",
    "invoice_number": "INV-017",
    "invoice_date": "2022-05-31",
    "due_date": "2022-07-28",
    "amount": "",
    "balance": 1285,
    "currency": "ARS"
  },
  {
    "id": "0004-000000362",
    "provider": "PROV-8",
    "status": "paid",
    "invoice_number": "INV-018",
    "invoice_date": "2022-11-18",
    "due_date": "2023-01-01",
    "amount": "",
    "balance": 4672,
    "currency": "ARS"
  },
  {
    "id": "0004-000000363",
    "provider": "PROV-8",
    "status": "paid",
    "invoice_number": "INV-019",
    "invoice_date": "2022-09-13",
    "due_date": "2022-10-10",
    "amount": "",
    "balance": 3885,
    "currency": "ARS"
  },
  {
    "id": "0004-000000364",
    "provider": "PROV-2",
    "status": "overdue",
    "invoice_number": "INV-020",
    "invoice_date": "2022-06-11",
    "due_date": "2022-07-01",
    "amount": "",
    "balance": 3656,
    "currency": "ARS"
  }
];

const suppliers = [
  { id: "PROV-1", name: "Barbijos S.A" },
  { id: "PROV-2", name: "Mascarillas Inc" },
  { id: "PROV-3", name: "Protección Global" },
  { id: "PROV-4", name: "MedCare S.A" },
  { id: "PROV-5", name: "EPP Supplies" },
  { id: "PROV-6", name: "Guantes S.A" },
  { id: "PROV-7", name: "Seguridad Total" },
  { id: "PROV-8", name: "HealthPro S.A" }
]


export default function ItemRow({ index, remove }: { index: number, remove: (index: number) => void }) {
  const { control, setValue } = useFormContext<z.infer<typeof newPaymentSchema>>()

  const invoice_status = useWatch({
    control,
    name: `invoices.${index}.status`,
  })

  const selected_provider = useWatch({
    control,
    name: `invoices.${index}.provider`,
  })

  const status = INVOICE_STATUSES[invoice_status as keyof typeof INVOICE_STATUSES]
  const filtered_bills = selected_provider ? bills.filter((bill) => bill.provider === selected_provider) : bills

  return (
    <TableRow className="group">
      <TableCell className="py-0 pl-0">
        <FormField
          control={control}
          name={`invoices.${index}.id`}
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between pl-3 font-normal min-w-[150px] border-none rounded-none",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? filtered_bills.find((bill) => bill.id === field.value)?.id : "Selecciona una factura"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0 w-max">
                  <Command>
                    <CommandInput
                      placeholder="Buscar facturas..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>
                        No se encontraron facturas.
                      </CommandEmpty>
                      <CommandGroup>
                        {filtered_bills.map((bill, bills_index) => {
                          const status = INVOICE_STATUSES[bill.status as keyof typeof INVOICE_STATUSES]
                          const provider = suppliers.find((supplier) => supplier.id === bill.provider)?.name
                          return (
                            <Fragment key={bill.id}>
                              <CommandItem
                                value={bill.id}
                                onSelect={() => {
                                  setValue(`invoices.${index}.id`, bill.id)
                                  setValue(`invoices.${index}.provider`, bill.provider)
                                  setValue(`invoices.${index}.status`, bill.status as any)
                                  setValue(`invoices.${index}.balance`, bill.balance)
                                  setValue(`invoices.${index}.amount`, bill.amount)
                                }}
                                className="px-2 py-1.5 rounded-none"
                              >
                                <div className="grid grid-cols-[1fr,150px,100px,auto] gap-4 items-center w-full">
                                  <div className="font-medium">{bill.id}</div>
                                  <p className="max-w-[150px] truncate">
                                    {provider}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                      <span
                                        className={cn(
                                          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                                          status.pure_bg_color
                                        )}
                                      ></span>
                                      <span
                                        className={cn(
                                          "relative inline-flex rounded-full h-2 w-2",
                                          status.pure_bg_color
                                        )}
                                      ></span>
                                    </span>
                                    <span className="text-sm">{status.label}</span>
                                  </div>
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      bill.id === field.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </div>
                              </CommandItem>
                              {bills_index !== bills.length - 1 && <Separator />}
                            </Fragment>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="py-0 pl-0">
        <FormField
          control={control}
          name={`invoices.${index}.provider`}
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between pl-3 font-normal min-w-[150px] border-none rounded-none",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? suppliers.find((supplier) => supplier.id === field.value)?.name : "Selecciona un proveedor"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0 w-max">
                  <Command>
                    <CommandInput
                      placeholder="Buscar facturas..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>
                        No se encontraron facturas.
                      </CommandEmpty>
                      <CommandGroup>
                        {suppliers.map((supplier) => {
                          return (
                            <CommandItem
                              value={supplier.id}
                              key={supplier.id}
                              onSelect={() => {
                                setValue(`invoices.${index}.id`, "")
                                setValue(`invoices.${index}.provider`, supplier.id)
                              }}
                              className="px-2 py-1.5 rounded-none"
                            >
                              {supplier.name}
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  supplier.id === field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="py-0 pl-0">
        <Badge
          variant="outline"
          className={cn(`${status?.bg_color} ${status?.text_color} border-none rounded-sm`)}
        >
          {status?.label}
        </Badge>
      </TableCell>
      <TableCell className="py-0">
        <FormField
          control={control}
          name={`invoices.${index}.balance`}
          render={({ field }) => (
            <FormItem className="flex flex-col w-[150px]">
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="500.00"
                    className="pl-9 border-0 rounded-none"
                    inputMode="decimal"
                    readOnly
                    onChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/,/g, '');

                      const regex = /^\d*(\.\d{0,2})?$/;
                      if (regex.test(value)) {
                        field.onChange(value);
                      }
                    }}
                  />
                  <div className="pointer-events-none absolute left-2 top-1/2 text-xs -translate-y-1/2 select-none opacity-50">
                    ARS
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="py-0">
        <FormField
          control={control}
          name={`invoices.${index}.amount`}
          render={({ field }) => (
            <FormItem className="flex flex-col w-[150px]">
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="500.00"
                    className="pl-9 border-0 rounded-none"
                    inputMode="decimal"
                    onChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/,/g, '');

                      const regex = /^\d*(\.\d{0,2})?$/;
                      if (regex.test(value)) {
                        field.onChange(value);
                      }
                    }}
                  />
                  <div className="pointer-events-none absolute left-2 top-1/2 text-xs -translate-y-1/2 select-none opacity-50">
                    ARS
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="py-0 pr-5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 transition-opacity opacity-0 group-hover:opacity-100"
          onClick={() => remove(index)}
        >
          <Trash2 className="!h-3.5 !w-3.5 text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  )
}