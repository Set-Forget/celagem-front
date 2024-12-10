"use client"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, CheckIcon, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newReceiptSchema } from "../schemas/receipts"
import ItemsTable from "./components/items-table"
import { Textarea } from "@/components/ui/textarea"

const accounts_receipted_to = [
  { id: "af1", name: "CAJA GENERAL" },
  { id: "af2", name: "CUENTA CORRIENTE" },
  { id: "af3", name: "CUENTA DE AHORRO" },
  { id: "af4", name: "CAJA CHICA" },
];

export default function NewReceiptPage() {
  const newReceiptForm = useForm<z.infer<typeof newReceiptSchema>>({
    resolver: zodResolver(newReceiptSchema),
    defaultValues: {
      payment_type: "receive",
      invoices: [
        {
          id: "0004-000000345",
          provider: "PROV-1",
          status: "overdue",
          invoice_number: "INV-001",
          invoice_date: "2022-01-01",
          due_date: "2022-01-31",
          amount: "",
          balance: 1000,
          currency: "ARS",
        },
        {
          id: "0004-000000346",
          provider: "PROV-2",
          status: "overdue",
          invoice_number: "INV-001",
          invoice_date: "2022-01-01",
          due_date: "2022-01-31",
          amount: "",
          balance: 2000,
          currency: "ARS",
        }
      ]
    }
  })

  const onSubmit = (data: z.infer<typeof newReceiptSchema>) => {
    console.log(data)
  }

  return (
    <>
      <Header title="Registrar cobro" />
      <Separator />
      <div className="flex flex-col h-full justify-between">
        <Form {...newReceiptForm}>
          <form onSubmit={newReceiptForm.handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Información del cobro</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newReceiptForm.control}
                  name="payment_mode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Modo de cobro
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Modo de cobro" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cash">
                              Efectivo
                            </SelectItem>
                            <SelectItem value="check">
                              Cheque
                            </SelectItem>
                            <SelectItem value="credit_card">
                              Tarjeta de crédito
                            </SelectItem>
                            <SelectItem value="debit_card">
                              Tarjeta de débito
                            </SelectItem>
                            <SelectItem value="bank_transfer">
                              Transferencia bancaria
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {newReceiptForm.formState.errors.payment_mode ? (
                        <FormMessage>
                          {newReceiptForm.formState.errors.payment_mode.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el modo de cobro que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newReceiptForm.control}
                  name="payment_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Fecha de cobro</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Seleccioná una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {newReceiptForm.formState.errors.payment_date ? (
                        <FormMessage>
                          {newReceiptForm.formState.errors.payment_date.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la fecha en la que se registrará el cobro.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newReceiptForm.control}
                  name="account_paid_from"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Cuenta contable destino
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between pl-3 font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? accounts_receipted_to.find(
                                  (account) => account.id === field.value?.id
                                )?.name
                                : "Cuenta destino de la empresa"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
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
                                {accounts_receipted_to.map((account) => (
                                  <CommandItem
                                    value={account.id}
                                    key={account.id}
                                    onSelect={() => {
                                      newReceiptForm.setValue("account_paid_from", account)
                                    }}
                                  >
                                    {account.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto",
                                        account.id === field.value?.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {newReceiptForm.formState.errors.company_bank_account ? (
                        <FormMessage>
                          {newReceiptForm.formState.errors.company_bank_account.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la cuenta destino de la empresa desde la que se realizará el cobro.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={newReceiptForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">
                      Notas
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Notas adicionales"
                        className="resize-none"
                      />
                    </FormControl>
                    {newReceiptForm.formState.errors.notes ? (
                      <FormMessage>
                        {newReceiptForm.formState.errors.notes.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Estas notas no serán visibles en el detalle del recibo.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Facturas a cobrar</span>
              <ItemsTable />
            </div>
          </form>
          <div className="flex justify-end gap-2 mt-4 p-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
            >
              Previsualizar
            </Button>
            <Button
              type="submit"
              onClick={newReceiptForm.handleSubmit(onSubmit)}
              size="sm"
            >
              Registrar cobro
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}