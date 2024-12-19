"use client"

import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newInvoiceSchema } from "../schemas/invoices"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ItemsTable from "./components/items-table"
import Header from "@/components/header"
import { Separator } from "@/components/ui/separator"
import { INVOICE_STATUSES } from "@/app/purchases/bills/adapters/invoices"

const companies = [
  { label: "Google", value: "30-67890123-4" },
  { label: "Facebook", value: "30-12345678-9" },
  { label: "Microsoft", value: "33-98765432-1" },
  { label: "Apple", value: "33-11223344-5" },
  { label: "Amazon", value: "34-55667788-0" },
  { label: "Tesla", value: "30-99887766-3" },
  { label: "Netflix", value: "31-44556677-2" },
  { label: "Twitter", value: "31-77665544-8" },
  { label: "Spotify", value: "32-33445566-7" },
  { label: "Adobe", value: "33-22334455-9" },
] as const;

const purchase_orders = [
  { id: "PO-1234", number: "OC-2002", status: "pending", supplier: "Google" },
  { id: "PO-1235", number: "OC-2003", status: "pending", supplier: "Facebook" },
  { id: "PO-1236", number: "OC-2004", status: "pending", supplier: "Microsoft" },
  { id: "PO-1237", number: "OC-2005", status: "pending", supplier: "Apple" },
  { id: "PO-1238", number: "OC-2006", status: "pending", supplier: "Amazon" },
  { id: "PO-1239", number: "OC-2007", status: "pending", supplier: "Tesla" },
  { id: "PO-1240", number: "OC-2008", status: "pending", supplier: "Netflix" },
  { id: "PO-1241", number: "OC-2009", status: "pending", supplier: "Twitter" },
  { id: "PO-1242", number: "OC-2010", status: "pending", supplier: "Spotify" },
  { id: "PO-1243", number: "OC-2011", status: "pending", supplier: "Adobe" },
] as const;

const accounts = [
  { number: "11", name: "EFECTIVO Y EQUIVALENTES AL EFECTIVO" },
  { number: "1101", name: "EFECTIVO" },
  { number: "110101", name: "CAJA GENERAL" },
  { number: "110101061", name: "CAJA GENERAL BOGOTA" },
  { number: "110102", name: "CAJAS MENORES" },
  { number: "110102061", name: "CAJAS MENORES" },
  { number: "110102062", name: "CAJA MENOR MEDELLIN" },
  { number: "110102063", name: "CAJA MENOR LEGALES" },
  { number: "110102064", name: "CAJA MENOR BUCARAMANGA" },
  { number: "110102069", name: "COMPRAS CAJA MENOR DOC SOPORTE" },
  { number: "110103", name: "CAJA MONEDA EXTRANJERA" },
  { number: "110104", name: "BANCOS CUENTAS CORRIENTES MONEDA NACIONAL" },
  { number: "110104061", name: "CTA CTE BANCO BBVA CTA No." },
  { number: "110105", name: "BANCOS CUENTAS CORRIENTES MONEDA EXTRANJERA" },
  { number: "110106", name: "BANCOS CUENTAS DE AHORRO BANCOS MONEDA NACIONAL" },
  { number: "110106061", name: "CTA AHORRO BANCO DAVIVIENDA CTA No" },
  { number: "110106062", name: "CTA AHORRO BANCOLOMBIA CTA N. 20100005011" },
  { number: "110107", name: "BANCOS CUENTAS DE AHORRO BANCOS MONEDA EXTRANJERA" },
  { number: "110108", name: "CARTERA COLECTIVA ABIERTA O FONDO DE INVERSIÓN MERCADO MONETARIO" },
  { number: "12", name: "INVERSIONES E INSTRUMENTOS DERIVADOS" }
];

const cost_centers = [
  {
    "id": "CC-2040",
    "name": "Recursos Humanos"
  },
  {
    "id": "CC-6997",
    "name": "Marketing"
  },
  {
    "id": "CC-7668",
    "name": "Innovación"
  },
  {
    "id": "CC-3248",
    "name": "Planta Industrial"
  },
  {
    "id": "CC-5670",
    "name": "Logística"
  },
  {
    "id": "CC-1542",
    "name": "Finanzas"
  },
  {
    "id": "CC-5405",
    "name": "Calidad"
  },
  {
    "id": "CC-8071",
    "name": "Ventas"
  },
  {
    "id": "CC-8608",
    "name": "Compras"
  },
  {
    "id": "CC-7873",
    "name": "Mantenimiento"
  },
  {
    "id": "CC-3669",
    "name": "Producción"
  },
]

export default function NewInvoicePage() {
  const newInvoiceForm = useForm<z.infer<typeof newInvoiceSchema>>({
    resolver: zodResolver(newInvoiceSchema),
    defaultValues: {
      items: []
    }
  })

  const onSubmit = (data: z.infer<typeof newInvoiceSchema>) => {
    console.log(data)
  }

  return (
    <>
      <Header />
      <div className="flex flex-col justify-between h-full">
        <Form {...newInvoiceForm}>
          <form onSubmit={newInvoiceForm.handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">General</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newInvoiceForm.control}
                  name="customer"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Cliente</FormLabel>
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
                                ? companies.find(
                                  (company) => company.value === field.value
                                )?.label
                                : "Selecciona un cliente"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Buscar clientes..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                No se encontraron clientes.
                              </CommandEmpty>
                              <CommandGroup>
                                {companies.map((company) => (
                                  <CommandItem
                                    value={company.label}
                                    key={company.value}
                                    onSelect={() => {
                                      newInvoiceForm.setValue("customer", company.value)
                                    }}
                                  >
                                    {company.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        company.value === field.value
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
                      {newInvoiceForm.formState.errors.customer ? (
                        <FormMessage>
                          {newInvoiceForm.formState.errors.customer.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la empresa a la que se le emitirá la factura.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newInvoiceForm.control}
                  name="invoice_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Fecha de emisión</FormLabel>
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
                      {newInvoiceForm.formState.errors.invoice_date ? (
                        <FormMessage>
                          {newInvoiceForm.formState.errors.invoice_date.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la fecha en la que se emite la factura.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newInvoiceForm.control}
                  name="order_number"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Orden de compra</FormLabel>
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
                              {field.value ? purchase_orders.find((purchase_order) => purchase_order.number === field.value)?.number : "Orden de compra"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0 w-max">
                          <Command>
                            <CommandInput
                              placeholder="Buscar órdenes de compra..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                No se encontraron órdenes de compra.
                              </CommandEmpty>
                              <CommandGroup>
                                {purchase_orders.map((purchase_order) => {
                                  const status = INVOICE_STATUSES[purchase_order.status as keyof typeof INVOICE_STATUSES]
                                  return (
                                    <CommandItem
                                      value={purchase_order.number}
                                      key={purchase_order.number}
                                      onSelect={() => {
                                        newInvoiceForm.setValue("order_number", purchase_order.number)
                                      }}
                                      className="px-2 py-1.5 rounded-none"
                                    >
                                      <div className="grid grid-cols-[1fr,150px,100px,auto] gap-4 items-center w-full">
                                        <div className="font-medium">{purchase_order.number}</div>
                                        <p className="max-w-[150px] truncate">{purchase_order.supplier}</p>
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
                                            purchase_order.number === field.value ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </div>
                                    </CommandItem>
                                  )
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {newInvoiceForm.formState.errors.order_number ? (
                        <FormMessage>
                          {newInvoiceForm.formState.errors.order_number.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Orden de compra relacionada con la factura.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Fiscal</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newInvoiceForm.control}
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
                      {newInvoiceForm.formState.errors.currency ? (
                        <FormMessage>
                          {newInvoiceForm.formState.errors.currency.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la moneda en la que se emitirá la factura.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newInvoiceForm.control}
                  name="payment_terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Condición de pago
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Condición de pago" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="anticipo">
                              Anticipo
                            </SelectItem>
                            <SelectItem value="7_dias">
                              7 días
                            </SelectItem>
                            <SelectItem value="15_dias">
                              15 días
                            </SelectItem>
                            <SelectItem value="30_dias">
                              30 días
                            </SelectItem>
                            <SelectItem value="60_dias">
                              60 días
                            </SelectItem>
                            <SelectItem value="90_dias">
                              90 días
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {newInvoiceForm.formState.errors.payment_terms ? (
                        <FormMessage>
                          {newInvoiceForm.formState.errors.payment_terms.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la condición de pago de la factura.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Contabilidad</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newInvoiceForm.control}
                  name="account"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Cuenta</FormLabel>
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
                                ? accounts.find(
                                  (company) => company.number === field.value
                                )?.name
                                : "Selecciona una cuenta"}
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
                                {accounts.map((account) => (
                                  <CommandItem
                                    value={account.number}
                                    key={account.number}
                                    onSelect={() => {
                                      newInvoiceForm.setValue("account", account.number)
                                    }}
                                  >
                                    <div className="flex flex-col">
                                      {account.name}
                                      <span className="text-xs text-muted-foreground">{account.number}</span>
                                    </div>
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        account.number === field.value
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
                      {newInvoiceForm.formState.errors.account ? (
                        <FormMessage>
                          {newInvoiceForm.formState.errors.account.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Cuenta contable relacionada con la factura.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newInvoiceForm.control}
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
                                  (cost_center) => cost_center.id === field.value
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
                                      newInvoiceForm.setValue("cost_center", cost_center.id)
                                    }}
                                  >
                                    {cost_center.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        cost_center.id === field.value
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
                      {newInvoiceForm.formState.errors.cost_center ? (
                        <FormMessage>
                          {newInvoiceForm.formState.errors.cost_center.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Centro de costos relacionado con la factura.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Items de la factura</span>
              <ItemsTable />
            </div>
          </form>
          <div className="flex justify-end gap-2 p-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
            >
              Previsualizar
            </Button>
            <Button
              type="submit"
              onClick={newInvoiceForm.handleSubmit(onSubmit)}
              size="sm"
            >
              Crear factura
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}