"use client"

import { CalendarIcon, Check, CheckIcon, ChevronsUpDown } from "lucide-react"

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
import { newBillSchema } from "../schemas/bills"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ItemsTable from "./components/items-table"
import Header from "@/components/header"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

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

const headquarters = [
  { id: "hq1", name: "Main Office" },
  { id: "hq2", name: "Regional Office - North" },
  { id: "hq3", name: "Regional Office - South" },
  { id: "hq4", name: "International Office - Europe" },
  { id: "hq5", name: "International Office - Asia" },
];

export default function NewBillPage() {
  const newBillForm = useForm<z.infer<typeof newBillSchema>>({
    resolver: zodResolver(newBillSchema),
    defaultValues: {
      items: []
    }
  })

  const onSubmit = (data: z.infer<typeof newBillSchema>) => {
    console.log(data)
  }

  return (
    <>
      <Header />
      <Separator />
      <div className="flex flex-col p-4 flex-1 justify-between">
        <Form {...newBillForm}>
          <form onSubmit={newBillForm.handleSubmit(onSubmit)} className="space-y-6 flex flex-col">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={newBillForm.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Proveedor</FormLabel>
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
                              : "Selecciona un proveedor"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Buscar proveedores..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron proveedores.
                            </CommandEmpty>
                            <CommandGroup>
                              {companies.map((company) => (
                                <CommandItem
                                  value={company.label}
                                  key={company.value}
                                  onSelect={() => {
                                    newBillForm.setValue("supplier", company.value)
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
                    {newBillForm.formState.errors.supplier ? (
                      <FormMessage>
                        {newBillForm.formState.errors.supplier.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Proveedor que figura en la factura.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
              <FormField
                control={newBillForm.control}
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
                    {newBillForm.formState.errors.currency ? (
                      <FormMessage>
                        {newBillForm.formState.errors.currency.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Moneda que figura en la factura de compra.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
              <FormField
                control={newBillForm.control}
                name="invoice_number"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Número de factura</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Número de factura"
                      />
                    </FormControl>
                    {newBillForm.formState.errors.invoice_number ? (
                      <FormMessage>
                        {newBillForm.formState.errors.invoice_number.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Número de factura que figura en el documento.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
              <FormField
                control={newBillForm.control}
                name="order_number"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Número de orden de compra</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Número de orden de compra"
                      />
                    </FormControl>
                    {newBillForm.formState.errors.order_number ? (
                      <FormMessage>
                        {newBillForm.formState.errors.order_number.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Número de orden de compra que figura en la factura.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
              <FormField
                control={newBillForm.control}
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
                    {newBillForm.formState.errors.invoice_date ? (
                      <FormMessage>
                        {newBillForm.formState.errors.invoice_date.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Fecha en la que se emitió la factura.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
              <FormField
                control={newBillForm.control}
                name="accounting_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Fecha de contabilización</FormLabel>
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
                    {newBillForm.formState.errors.accounting_date ? (
                      <FormMessage>
                        {newBillForm.formState.errors.accounting_date.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Fecha en la que se registrará la factura en la contabilización.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
              <FormField
                control={newBillForm.control}
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
                                    newBillForm.setValue("account", account.number)
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
                    {newBillForm.formState.errors.account ? (
                      <FormMessage>
                        {newBillForm.formState.errors.account.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Cuenta contable a la que se cargará la factura.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
              <FormField
                control={newBillForm.control}
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
                                    newBillForm.setValue("cost_center", cost_center.id)
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
                    {newBillForm.formState.errors.cost_center ? (
                      <FormMessage>
                        {newBillForm.formState.errors.cost_center.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Centro de costos al que se cargará la factura.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
              <FormField
                control={newBillForm.control}
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
                    {newBillForm.formState.errors.payment_terms ? (
                      <FormMessage>
                        {newBillForm.formState.errors.payment_terms.message}
                      </FormMessage>
                    ) :
                      <FormDescription>
                        Este será el tipo de pago que se registrará.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
            </div>
            <ItemsTable />
          </form>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
            >
              Previsualizar
            </Button>
            <Button
              type="submit"
              onClick={newBillForm.handleSubmit(onSubmit)}
              size="sm"
            >
              Crear Factura
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}