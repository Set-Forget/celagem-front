import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  TableCell,
  TableRow
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, Trash2 } from "lucide-react"
import { Fragment } from "react"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newJournalEntrySchema } from "../../schemas/journal-entries"

const accounts = [
  { label: "Caja General", value: "cash_on_hand" },
  { label: "Banco Cuenta Corriente", value: "bank_current_account" },
  { label: "Clientes por Cobrar", value: "accounts_receivable" },
  { label: "Proveedores por Pagar", value: "accounts_payable" },
  { label: "Inventario de Mercancías", value: "inventory_goods" },
  { label: "Capital Social", value: "capital_stock" },
  { label: "Ventas del Periodo", value: "sales_revenue" },
  { label: "Costos de Ventas", value: "cost_of_goods_sold" },
  { label: "Gastos Administrativos", value: "administrative_expenses" },
  { label: "Impuestos por Pagar", value: "taxes_payable" }
];

export default function ItemRow({ index, remove }: { index: number, remove: (index: number) => void }) {
  const { control } = useFormContext<z.infer<typeof newJournalEntrySchema>>()

  return (
    <TableRow className="group">
      <TableCell className="py-0 pl-0">
        <FormField
          control={control}
          name={`items.${index}.account`}
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
                      {field.value ? accounts.find((account) => account.label === field.value)?.label : "Selecciona una cuenta"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0 w-max">
                  <Command>
                    <CommandInput
                      placeholder="Buscar cuentas..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>
                        No se encontraron cuentas.
                      </CommandEmpty>
                      <CommandGroup>
                        {accounts.map((account, account_index) => {
                          return (
                            <Fragment key={account.value}>
                              <CommandItem
                                value={account.label}
                                onSelect={() => {
                                  field.onChange(account.label)
                                }}
                                className="px-2 py-1.5 rounded-none"
                              >
                                <div className="grid grid-cols-[1fr,auto] gap-4 items-center w-full">
                                  <div className="font-medium">{account.label}</div>
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      account.label === field.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </div>
                              </CommandItem>
                              {account_index !== accounts.length - 1 && <Separator />}
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
      <TableCell className="py-0">
        <FormField
          control={control}
          name={`items.${index}.debit`}
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
          name={`items.${index}.credit`}
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