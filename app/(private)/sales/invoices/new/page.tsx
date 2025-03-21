"use client"

import { CalendarIcon, Check, ChevronsUpDown, EllipsisIcon, House } from "lucide-react"

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
import { AsyncSelect } from "@/components/async-select"
import FormTable from "@/components/form-table"
import Header from "@/components/header"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TableFooter from "./components/table-footer"
import { columns } from "./components/columns"
import { Textarea } from "@/components/ui/textarea"
import { useLazyListCustomersQuery } from "@/lib/services/customers"
import { useCreateInvoiceMutation } from "@/lib/services/invoices"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import CustomSonner from "@/components/custom-sonner"

// ! Debe traerse de la API
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

// ! Debe traerse de la API
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

// ! Debe traerse de la API
const currencies = [
  { label: "ARS (Peso argentino)", value: "ARS", id: 1 },
  { label: "COP (Peso colombiano)", value: "COP", id: 2 },
  { label: "USD (Dólar estadounidense)", value: "USD", id: 3 },
] as const;

const randomInvoiceNumber = () => Math.floor(Math.random() * 1000000).toString()

export default function NewInvoicePage() {
  const router = useRouter()

  const [searchCustomers] = useLazyListCustomersQuery()
  const [createInvoice, { isLoading: isCreatingInvoice }] = useCreateInvoiceMutation()

  const newInvoiceForm = useForm<z.infer<typeof newInvoiceSchema>>({
    resolver: zodResolver(newInvoiceSchema),
    defaultValues: {
      items: [],
      date: "",
      accounting_date: "",
      number: randomInvoiceNumber(),
      accounting_account: "",
      cost_center: "",
      notes: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof newInvoiceSchema>) => {
    try {
      const response = await createInvoice({
        ...data,
        currency: 1,
        payment_term: 2,
        items: data.items.map((item) => ({
          ...item,
          taxes_id: [1]
        }))
      }).unwrap()

      if (response.status === "success") {
        router.push(`/sales/invoices/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Factura de venta creada exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la factura de venta" variant="error" />)
    }
  }

  const handleSearchCustomer = async (query?: string) => {
    try {
      const response = await searchCustomers({ name: query }).unwrap()
      return response.data?.map(customer => ({
        id: customer.id,
        name: customer.name
      }))
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  return (
    <Form {...newInvoiceForm}>
      <Header title="Nueva factura de venta">
        <div className="flex gap-2 p-4 ml-auto">
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
            loading={isCreatingInvoice}
          >
            Crear factura de venta
          </Button>
        </div>
      </Header>
      <Tabs className="mt-4" defaultValue="tab-1">
        <ScrollArea>
          <TabsList className="relative justify-start !pl-4 h-auto w-full gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
            <TabsTrigger
              value="tab-1"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <House
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              General
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <EllipsisIcon
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Otros
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="tab-1" className="m-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <FormField
              control={newInvoiceForm.control}
              name="customer"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">Cliente</FormLabel>
                  <AsyncSelect<{ id: number, name: string }, number>
                    label="Cliente"
                    triggerClassName="!w-full"
                    placeholder="Seleccionar cliente..."
                    fetcher={handleSearchCustomer}
                    getDisplayValue={(item) => item.name}
                    getOptionValue={(item) => item.id}
                    renderOption={(item) => <div>{item.name}</div>}
                    onChange={field.onChange}
                    value={field.value}
                    getOptionKey={(item) => String(item.id)}
                    noResultsMessage="No se encontraron resultados"
                  />
                  {newInvoiceForm.formState.errors.customer ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Cliente que figura en la factura.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
            <FormField
              control={newInvoiceForm.control}
              name="date"
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
                        onSelect={(date) => {
                          if (!date) return
                          newInvoiceForm.setValue("date", date?.toISOString(), { shouldValidate: true })
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {newInvoiceForm.formState.errors.date ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Fecha en la que se emitió la factura.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
            <FormField
              control={newInvoiceForm.control}
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
                        onSelect={(date) => {
                          if (!date) return
                          newInvoiceForm.setValue("accounting_date", date?.toISOString(), { shouldValidate: true })
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {newInvoiceForm.formState.errors.accounting_date ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Fecha en la que se registrará la factura en la contabilización.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
            <FormField
              control={newInvoiceForm.control}
              name="accounting_account"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">Cuenta contable</FormLabel>
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
                              (account) => account.number === field.value
                            )?.name
                            : "Selecciona una cuenta contable"}
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
                                  newInvoiceForm.setValue("accounting_account", account.number, { shouldValidate: true })
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
                  {newInvoiceForm.formState.errors.accounting_account ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Cuenta contable a la que se cargará la factura.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
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
                        {currencies.map((currency) => (
                          <SelectItem
                            key={currency.id}
                            value={String(currency.id)}
                          >
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {newInvoiceForm.formState.errors.currency ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Moneda que figura en la factura de compra.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
            <FormField
              control={newInvoiceForm.control}
              name="payment_term"
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
                        <SelectItem value="0">
                          Anticipo
                        </SelectItem>
                        <SelectItem value="1">
                          7 días
                        </SelectItem>
                        <SelectItem value="2">
                          15 días
                        </SelectItem>
                        <SelectItem value="3">
                          30 días
                        </SelectItem>
                        <SelectItem value="4">
                          60 días
                        </SelectItem>
                        <SelectItem value="5">
                          90 días
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {newInvoiceForm.formState.errors.payment_term ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Este será el tipo de pago que se registrará.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
            <FormField
              control={newInvoiceForm.control}
              name="items"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full col-span-2">
                  <FormLabel className="w-fit">Items</FormLabel>
                  <FormControl>
                    <FormTable<z.infer<typeof newInvoiceSchema>>
                      columns={columns}
                      footer={({ append }) => <TableFooter append={append} />}
                      name="items"
                      className="col-span-2"
                    />
                  </FormControl>
                  {newInvoiceForm.formState.errors.items?.message && (
                    <p className="text-destructive text-[12.8px] mt-1 font-medium">
                      {newInvoiceForm.formState.errors.items.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={newInvoiceForm.control}
              name="tyc_notes"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full col-span-2">
                  <FormLabel className="w-fit">Términos y condiciones</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Términos y condiciones"
                    />
                  </FormControl>
                  {newInvoiceForm.formState.errors.tyc_notes ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Los términos y condiciones aparecerán en la factura.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
          </div>
        </TabsContent>
        <TabsContent value="tab-2" className="m-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            {/* <FormField
            control={newInvoiceForm.control}
            name="purchase_order"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="w-fit">Orden de compra</FormLabel>
                <FormControl>
                  <AsyncSelect<{ id: number, number: string }, number | undefined>
                    label="Orden de compra"
                    triggerClassName="!w-full"
                    placeholder="Seleccionar orden de compra..."
                    fetcher={handleSearchPurchaseOrder}
                    getDisplayValue={(item) => item.number}
                    getOptionValue={(item) => item.id}
                    renderOption={(item) => <div>{item.number}</div>}
                    onChange={field.onChange}
                    value={field.value}
                    getOptionKey={(item) => String(item.id)}
                    noResultsMessage="No se encontraron resultados"
                  />
                </FormControl>
                {newInvoiceForm.formState.errors.purchase_order ? (
                  <FormMessage />
                ) :
                  <FormDescription>
                    Número de orden de compra que figura en la factura.
                  </FormDescription>
                }
              </FormItem>
            )}
          /> */}
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
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Centro de costos al que se cargará la factura.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
            <FormField
              control={newInvoiceForm.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full col-span-2">
                  <FormLabel className="w-fit">Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Notas"
                    />
                  </FormControl>
                  {newInvoiceForm.formState.errors.notes ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Notas adicionales sobre la factura.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
          </div>
        </TabsContent>
      </Tabs>
    </Form>
  )
}