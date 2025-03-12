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
import { newPaymentSchema } from "../schemas/payments"
import ItemsTable from "./components/items-table"
import { Textarea } from "@/components/ui/textarea"

const accounts_paid_from = [
  { id: "af1", name: "CAJA GENERAL" },
  { id: "af2", name: "CUENTA CORRIENTE" },
  { id: "af3", name: "CUENTA DE AHORRO" },
  { id: "af4", name: "CAJA CHICA" },
];

export default function NewPurchaseReceivePage() {
  const newPaymentForm = useForm<z.infer<typeof newPaymentSchema>>({
    resolver: zodResolver(newPaymentSchema),
    defaultValues: {
      payment_type: "pay",
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

  const onSubmit = (data: z.infer<typeof newPaymentSchema>) => {
    console.log(data)
  }

  return (
    <>
      <Header />
      <Separator />
      <div className="flex flex-col h-full justify-between">
        <Form {...newPaymentForm}>
          <form onSubmit={newPaymentForm.handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Información del pago</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newPaymentForm.control}
                  name="payment_mode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Modo de pago
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Modo de pago" />
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
                      {newPaymentForm.formState.errors.payment_mode ? (
                        <FormMessage>
                          {newPaymentForm.formState.errors.payment_mode.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el modo de pago que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPaymentForm.control}
                  name="payment_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Fecha de pago</FormLabel>
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
                      {newPaymentForm.formState.errors.payment_date ? (
                        <FormMessage>
                          {newPaymentForm.formState.errors.payment_date.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la fecha en la que se registrará el pago.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPaymentForm.control}
                  name="account_paid_from"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Cuenta contable origen
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
                                ? accounts_paid_from.find(
                                  (account) => account.id === field.value?.id
                                )?.name
                                : "Cuenta origen de la empresa"}
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
                                {accounts_paid_from.map((account) => (
                                  <CommandItem
                                    value={account.id}
                                    key={account.id}
                                    onSelect={() => {
                                      newPaymentForm.setValue("account_paid_from", account)
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
                      {newPaymentForm.formState.errors.company_bank_account ? (
                        <FormMessage>
                          {newPaymentForm.formState.errors.company_bank_account.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la cuenta origen de la empresa desde la que se realizará el pago.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={newPaymentForm.control}
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
                    {newPaymentForm.formState.errors.notes ? (
                      <FormMessage>
                        {newPaymentForm.formState.errors.notes.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Estas notas no serán visibles en el detalle del pago.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Facturas a pagar</span>
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
              onClick={newPaymentForm.handleSubmit(onSubmit)}
              size="sm"
            >
              Registrar pago
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}