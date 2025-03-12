"use client"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newSupplierSchema } from "../schema/suppliers"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { economic_activity, payment_methods } from "./data"
import { Switch } from "@/components/ui/switch"
import { useCreateSupplierMutation } from "@/lib/services/suppliers"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import CustomSonner from "@/components/custom-sonner"

// ! Debe traerse de la API
const currencies = [
  { label: "ARS (Peso argentino)", value: "ARS", id: 1 },
  { label: "COP (Peso colombiano)", value: "COP", id: 2 },
  { label: "USD (Dólar estadounidense)", value: "USD", id: 3 },
] as const;

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


export default function NewSupplierPage() {
  const router = useRouter()

  const [createSupplier, { isLoading: isCreatingSupplier }] = useCreateSupplierMutation()

  const newSupplierForm = useForm<z.infer<typeof newSupplierSchema>>({
    resolver: zodResolver(newSupplierSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      website: "",
      contact_address_inline: "",
      vat: 1,
      property_account_position: false,
      commercial_company_name: "",
      tax_id: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof newSupplierSchema>) => {
    try {
      const response = await createSupplier({
        ...data,
        property_payment_term: 1,
      }).unwrap()

      if (response.status === "success") {
        router.push(`/purchases/vendors/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Proveedor creado exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear el proveedor" />)
    }
  }

  return (
    <>
      <Header title="Nuevo proveedor" >
        <Button
          type="submit"
          onClick={newSupplierForm.handleSubmit(onSubmit)}
          size="sm"
          className="ml-auto"
          loading={isCreatingSupplier}
        >
          Crear proveedor
        </Button>
      </Header>
      <div className="flex flex-col h-full justify-between">
        <Form {...newSupplierForm}>
          <form onSubmit={newSupplierForm.handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">General</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newSupplierForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Nombre</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Celagem"
                        />
                      </FormControl>
                      {newSupplierForm.formState.errors.name ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Este será el nombre del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Número de teléfono</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="+1 123 456 7890"
                        />
                      </FormControl>
                      {newSupplierForm.formState.errors.phone ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Este será el número de teléfono del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Correo electrónico</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="ventas@guantes.com"
                        />
                      </FormControl>
                      {newSupplierForm.formState.errors.email ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Este será el correo electrónico del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Sitio web</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://guantes.com"
                        />
                      </FormControl>
                      {newSupplierForm.formState.errors.website ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Este será el sitio web del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="contact_address_inline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Dirección</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Av. Corrientes 1234, CABA, Argentina"
                        />
                      </FormControl>
                      {newSupplierForm.formState.errors.contact_address_inline ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Esta será la dirección del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Fiscal y contable</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newSupplierForm.control}
                  name="commercial_company_name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Nombre registrado</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Guantes S.A."
                        />
                      </FormControl>
                      {newSupplierForm.formState.errors.commercial_company_name ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Este será el nombre registrado del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
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
                      {newSupplierForm.formState.errors.currency ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Esta será la moneda en la que se registrarán las transacciones del proveedor.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="tax_type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Tipo de documento
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Regimen tributario" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="11">
                              Registro civil de nacimiento
                            </SelectItem>
                            <SelectItem value="12">
                              Tarjeta de identidad
                            </SelectItem>
                            <SelectItem value="13">
                              Cédula de ciudadanía
                            </SelectItem>
                            <SelectItem value="21">
                              Tarjeta de extranjería
                            </SelectItem>
                            <SelectItem value="22">
                              Cédula de extranjería
                            </SelectItem>
                            <SelectItem value="31">
                              NIT/CUIT
                            </SelectItem>
                            <SelectItem value="41">
                              Pasaporte
                            </SelectItem>
                            <SelectItem value="42">
                              Tipo doc. extranjero
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {newSupplierForm.formState.errors.tax_type ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Este será el tipo de documento del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="tax_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Identificación fiscal</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="30-12345678-9"
                        />
                      </FormControl>
                      {newSupplierForm.formState.errors.tax_id ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Este será el CUIT/NIT del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="property_payment_term"
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
                      {newSupplierForm.formState.errors.property_payment_term ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Este será la condición de pago del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Metodo de pago</FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn("justify-between font-normal pl-3", !field.value && "text-muted-foreground")}
                            >
                              <p className="truncate">
                                {field.value
                                  ? payment_methods.find((type) => type.value === field.value)?.label
                                  : "Seleccionar método de pago"}
                              </p>
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0">
                          <Command>
                            <CommandInput placeholder="Buscar..." className="h-8" />
                            <CommandList>
                              <CommandEmpty>No se encontraron resultados</CommandEmpty>
                              <CommandGroup>
                                {payment_methods.map((type) => (
                                  <CommandItem
                                    value={type.label}
                                    key={type.value}
                                    onSelect={() => {
                                      newSupplierForm.setValue("payment_method", type.value, { shouldValidate: true });
                                    }}
                                  >
                                    {type.label}
                                    <Check className={cn("ml-auto", type.value === field.value ? "opacity-100" : "opacity-0")} />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {newSupplierForm.formState.errors.payment_method ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Este será el método de pago del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="tax_regime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Regimen tributario
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Regimen tributario" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EE">
                              Empresas del estado
                            </SelectItem>
                            <SelectItem value="EX">
                              Extranjero
                            </SelectItem>
                            <SelectItem value="GC">
                              Gran contribuyente
                            </SelectItem>
                            <SelectItem value="NR">
                              No responsable de IVA
                            </SelectItem>
                            <SelectItem value="RE">
                              Régimen especial
                            </SelectItem>
                            <SelectItem value="RCN">
                              Régimen común no retenedor
                            </SelectItem>
                            <SelectItem value="RC">
                              Régimen común
                            </SelectItem>
                            <SelectItem value="RS">
                              Régimen simplificado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {newSupplierForm.formState.errors.tax_regime ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Este será el regimen tributario del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="tax_category"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Regimen fiscal
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Regimen fiscal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="4">
                              Régimen simple
                            </SelectItem>
                            <SelectItem value="5">
                              Régimen ordinario
                            </SelectItem>
                            <SelectItem value="48">
                              Impuesto sobre las ventas - IVA
                            </SelectItem>
                            <SelectItem value="49">
                              No responsable de IVA
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {newSupplierForm.formState.errors.tax_category ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Este será el regimen fiscal del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="tax_information"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Información tributaria
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Información tributaria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="01">
                              IVA
                            </SelectItem>
                            <SelectItem value="04">
                              INC
                            </SelectItem>
                            <SelectItem value="ZA">
                              IVA e INC
                            </SelectItem>
                            <SelectItem value="ZZ">
                              No Aplica
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {newSupplierForm.formState.errors.tax_information ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Este será la información tributaria del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="fiscal_responsibility"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Responsabilidad fiscal
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Responsabilidad fiscal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="O-13">
                              Gran contribuyente
                            </SelectItem>
                            <SelectItem value="O-15">
                              Autorretenedor
                            </SelectItem>
                            <SelectItem value="O-23">
                              Agente de retención IVA
                            </SelectItem>
                            <SelectItem value="O-47">
                              Régimen simple de tributación
                            </SelectItem>
                            <SelectItem value="R-99-PN">
                              No aplica - Otros
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {newSupplierForm.formState.errors.fiscal_responsibility ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Este será la responsabilidad fiscal del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="economic_activity"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Actividad económica</FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn("justify-between font-normal pl-3", !field.value && "text-muted-foreground")}
                            >
                              <p className="truncate">
                                {field.value
                                  ? economic_activity.find((type) => type.value === field.value)?.label
                                  : "Seleccionar actividad económica"}
                              </p>
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0">
                          <Command>
                            <CommandInput placeholder="Buscar..." className="h-8" />
                            <CommandList>
                              <CommandEmpty>No se encontraron resultados</CommandEmpty>
                              <CommandGroup>
                                {economic_activity.map((type) => (
                                  <CommandItem
                                    value={type.label}
                                    key={type.value}
                                    onSelect={() => {
                                      newSupplierForm.setValue("economic_activity", type.value, { shouldValidate: true });
                                    }}
                                  >
                                    {type.label}
                                    <Check className={cn("ml-auto", type.value === field.value ? "opacity-100" : "opacity-0")} />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {newSupplierForm.formState.errors.economic_activity ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Esta será la actividad económica del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="entity_type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Tipo de persona
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo de persona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">
                              Natural
                            </SelectItem>
                            <SelectItem value="2">
                              Juridica
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {newSupplierForm.formState.errors.entity_type ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Este será el tipo de persona del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="nationality_type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Tipo de nacionalidad
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo de nacionalidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">
                              Nacional
                            </SelectItem>
                            <SelectItem value="2">
                              Extranjero
                            </SelectItem>
                            <SelectItem value="3">
                              PT con clave
                            </SelectItem>
                            <SelectItem value="4">
                              PT sin clave
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {newSupplierForm.formState.errors.nationality_type ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Este será el tipo de nacionalidad del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
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
                                      newSupplierForm.setValue("accounting_account", account.number, { shouldValidate: true })
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
                      {newSupplierForm.formState.errors.accounting_account ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Esta será la cuenta contable del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="is_resident"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2 col-start-1">
                      <div className="flex flex-row rounded-sm border h-9 px-3 shadow-sm items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>¿Es residente?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Este campo indica si el proveedor es residente.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}