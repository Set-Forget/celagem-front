"use client"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"

const customers = [
  { id: "c1", name: "John Doe", balance: -120.50 },
  { id: "c2", name: "Jane Smith", balance: -350.00 },
  { id: "c3", name: "Michael Johnson", balance: -89.75 },
  { id: "c4", name: "Emily Davis", balance: -234.10 },
  { id: "c5", name: "David Brown", balance: -145.20 },
];

const suppliers = [
  { id: "s1", name: "Global Supplies Ltd.", balance: -560.00 },
  { id: "s2", name: "Tech Solutions Inc.", balance: -430.25 },
  { id: "s3", name: "Industrial Co.", balance: -220.00 },
  { id: "s4", name: "Fresh Produce Ltd.", balance: -300.00 },
  { id: "s5", name: "Build & Design Group", balance: -150.75 },
];

const company_bank_account = [{
  id: "cb1",
  name: "Corporate Account - Bank of America",
}];

const party_bank_accounts = [
  { id: "pb1", name: "Supplier Account - Chase Bank" },
  { id: "pb2", name: "Customer Account - Wells Fargo" },
];

const accounts_paid_from = [
  { id: "af1", name: "CAJA GENERAL" },
];

const accounts_paid_to = [
  { id: "at2", name: "PROVEEDORES" },
];

const cost_centers = [
  { id: "cc1", name: "Marketing Department" },
  { id: "cc2", name: "Research and Development" },
  { id: "cc3", name: "Sales Team" },
  { id: "cc4", name: "IT Infrastructure" },
  { id: "cc5", name: "Human Resources" },
];

export default function NewPurchaseReceivePage() {
  const newPaymentForm = useForm<z.infer<typeof newPaymentSchema>>({
    resolver: zodResolver(newPaymentSchema),
    defaultValues: {
      payment_type: "pay",
    }
  })

  const onSubmit = (data: z.infer<typeof newPaymentSchema>) => {
    console.log(data)
  }

  const partyOptions = newPaymentForm.watch("party_type") === "customer" ? customers : suppliers
  const currency = newPaymentForm.watch("currency")

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
                  name="payment_type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Tipo de pago
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo de pago" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pay">
                              Pago
                            </SelectItem>
                            <SelectItem value="receive">
                              Cobro
                            </SelectItem>
                            <SelectItem value="transfer">
                              Transferencia interna
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {newPaymentForm.formState.errors.payment_type ? (
                        <FormMessage>
                          {newPaymentForm.formState.errors.payment_type.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el tipo de pago que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
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
                  name="transaction_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">ID de la transacción</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="30000000230"
                        />
                      </FormControl>
                      {newPaymentForm.formState.errors.transaction_id ? (
                        <FormMessage>
                          {newPaymentForm.formState.errors.transaction_id.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el ID de la transacción que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPaymentForm.control}
                  name="cost_center"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Centro de costos</FormLabel>
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
                                ? cost_centers.find(
                                  (cost_center) => cost_center.id === field.value?.id
                                )?.name
                                : "Selecciona un centro de costos"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Buscar centros de costos..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                No se encontraron centros de costos.
                              </CommandEmpty>
                              <CommandGroup>
                                {cost_centers.map((cost_center) => (
                                  <CommandItem
                                    value={cost_center.id}
                                    key={cost_center.id}
                                    onSelect={() => {
                                      newPaymentForm.setValue("cost_center", cost_center)
                                    }}
                                  >
                                    {cost_center.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto",
                                        cost_center.id === field.value?.id
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
                      {newPaymentForm.formState.errors.cost_center ? (
                        <FormMessage>
                          {newPaymentForm.formState.errors.cost_center.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Centro de costos al que se cargará la factura.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Pago desde/hacia</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newPaymentForm.control}
                  name="party_type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Tipo de parte
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo de parte" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="customer">
                              Cliente
                            </SelectItem>
                            <SelectItem value="supplier">
                              Proveedor
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {newPaymentForm.formState.errors.party_type ? (
                        <FormMessage>
                          {newPaymentForm.formState.errors.party_type.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el tipo de pago que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPaymentForm.control}
                  name="party"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Parte
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
                                ? partyOptions.find(
                                  (party) => party.id === field.value?.id
                                )?.name
                                : "Parte"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Buscar partes..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                No se encontraron partes.
                              </CommandEmpty>
                              <CommandGroup>
                                {partyOptions.map((party) => (
                                  <CommandItem
                                    value={party.id}
                                    key={party.id}
                                    onSelect={() => {
                                      newPaymentForm.setValue("party", party)
                                    }}
                                  >
                                    {party.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto",
                                        party.id === field.value?.id
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
                      {newPaymentForm.formState.errors.payment_mode ? (
                        <FormMessage>
                          {newPaymentForm.formState.errors.payment_mode.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la parte que se registrará en el pago.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPaymentForm.control}
                  name="company_bank_account"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Cuenta bancaria de la empresa
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
                                ? company_bank_account.find(
                                  (bank_account) => bank_account.id === field.value?.id
                                )?.name
                                : "Cuenta bancaria de la empresa"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Buscar cuentas bancarias..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                No se encontraron cuentas bancarias.
                              </CommandEmpty>
                              <CommandGroup>
                                {company_bank_account.map((bank_account) => (
                                  <CommandItem
                                    value={bank_account.id}
                                    key={bank_account.id}
                                    onSelect={() => {
                                      newPaymentForm.setValue("company_bank_account", bank_account)
                                    }}
                                  >
                                    {bank_account.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto",
                                        bank_account.id === field.value?.id
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
                          Esta será la cuenta bancaria de la empresa que se registrará en el pago.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPaymentForm.control}
                  name="party_bank_account"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Cuenta bancaria de la parte
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
                                ? party_bank_accounts.find(
                                  (bank_account) => bank_account.id === field.value?.id
                                )?.name
                                : "Cuenta bancaria de la parte"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Buscar cuentas bancarias..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                No se encontraron cuentas bancarias.
                              </CommandEmpty>
                              <CommandGroup>
                                {party_bank_accounts.map((bank_account) => (
                                  <CommandItem
                                    value={bank_account.id}
                                    key={bank_account.id}
                                    onSelect={() => {
                                      newPaymentForm.setValue("party_bank_account", bank_account)
                                    }}
                                  >
                                    {bank_account.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto",
                                        bank_account.id === field.value?.id
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
                          Esta será la cuenta bancaria de la parte que se registrará en el pago.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Cuentas</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">
                    Balance de la parte
                  </FormLabel>
                  <Input
                    readOnly
                    value={`ARS ${newPaymentForm.watch("party")?.balance || 0}`}
                    placeholder="Balance de la parte"
                  />
                  <FormDescription>
                    Este es el balance actual de la parte seleccionada.
                  </FormDescription>
                </FormItem>
                <FormField
                  control={newPaymentForm.control}
                  name="account_paid_to"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Cuenta pagada a
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
                                ? accounts_paid_to.find(
                                  (account) => account.id === field.value?.id
                                )?.name
                                : "Cuenta pagada a"}
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
                                {accounts_paid_to.map((account) => (
                                  <CommandItem
                                    value={account.id}
                                    key={account.id}
                                    onSelect={() => {
                                      newPaymentForm.setValue("account_paid_to", account)
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
                      {newPaymentForm.formState.errors.account_paid_to ? (
                        <FormMessage>
                          {newPaymentForm.formState.errors.account_paid_to.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la cuenta contable a la que se registrará el pago.
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
                        Cuenta pagada desde
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
                                : "Cuenta pagada desde"}
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
                          Esta será la cuenta contable desde la que se registrará el pago.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Monto</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newPaymentForm.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Moneda</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Moneda" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ARS">
                              ARS (Peso argentino)
                            </SelectItem>
                            <SelectItem value="COP">
                              COP (Peso colombiano)
                            </SelectItem>
                            <SelectItem value="USD">
                              USD (Dólar estadounidense)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {newPaymentForm.formState.errors.currency ? (
                        <FormMessage>
                          {newPaymentForm.formState.errors.currency.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Moneda en la que se registrará el pago.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPaymentForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Monto del pago
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            className="pl-9"
                            placeholder="500.00"
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
                            {currency}
                          </div>
                        </div>
                      </FormControl>
                      {newPaymentForm.formState.errors.company_bank_account ? (
                        <FormMessage>
                          {newPaymentForm.formState.errors.company_bank_account.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el monto del pago que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Referencias</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newPaymentForm.control}
                  name="invoice_reference"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Número de factura
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="FC-334000000"
                        />
                      </FormControl>
                      {newPaymentForm.formState.errors.invoice_reference ? (
                        <FormMessage>
                          {newPaymentForm.formState.errors.invoice_reference.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el número de factura que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPaymentForm.control}
                  name="purchase_order_reference"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Número de orden de compra
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="OC-334000000"
                        />
                      </FormControl>
                      {newPaymentForm.formState.errors.purchase_order_reference ? (
                        <FormMessage>
                          {newPaymentForm.formState.errors.purchase_order_reference.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el número de orden de compra que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
              </div>
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