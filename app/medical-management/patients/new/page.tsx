"use client"

import { AsyncSelect } from "@/components/async-select"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useLazyGetAutocompleteQuery } from "@/lib/services/google-places"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { newPatientSchema } from "../schema/patients"
import { useListClassesQuery } from "@/lib/services/users"

const DOCUMENT_TYPES = [
  {
    value: "adult-without-identification",
    label: "Adulto sin identificación",
  },
  {
    value: "citizen-id",
    label: "Cédula de ciudadanía",
  },
  {
    value: "dni",
    label: "Documento nacional de identidad",
  },
  {
    value: "unique-population-registration-key",
    label: "Clave única de registro de población",
  },
  {
    value: "immigration-card",
    label: "Cédula de extranjería",
  },
  {
    value: "minor-without-identification",
    label: "Menor sin identificación",
  },
  {
    value: "passport",
    label: "Pasaporte",
  },
  {
    value: "civil-registry",
    label: "Registro civil",
  },
  {
    value: "cuit",
    label: "CUIT",
  },
] as const

const BIOLOGICAL_SEX_TYPES = [
  {
    value: "male",
    label: "Masculino",
  },
  {
    value: "female",
    label: "Femenino",
  },
  {
    value: "both",
    label: "Ambos",
  },
] as const

const GENDER_IDENTITY_TYPES = [
  {
    value: "cisgender",
    label: "Cisgénero",
  },
  {
    value: "no-binary",
    label: "No binario",
  },
  {
    value: "transgender",
    label: "Transgénero",
  },
  {
    value: "fluent",
    label: "Fluido",
  },
  {
    value: "other",
    label: "Otro",
  },
] as const

const DISABILITY_TYPES = [
  {
    value: "visual",
    label: "Discapacidad visual",
  },
  {
    value: "physical",
    label: "Discapacidad física",
  },
  {
    value: "hearing",
    label: "Discapacidad auditiva",
  },
  {
    value: "mental",
    label: "Discapacidad mental",
  },
  {
    value: "intellectual",
    label: "Discapacidad intelectual",
  },
  {
    value: "multiple",
    label: "Discapacidad múltiple",
  },
  {
    value: "psychosocial",
    label: "Dispacidad psicosocial",
  },
  {
    label: "Discapacidad sordoceguera",
    value: "deafblindness",
  },
  {
    value: "other",
    label: "Otra",
  },
] as const

export default function NewPatientPage() {
  const newPatientForm = useForm<z.infer<typeof newPatientSchema>>({
    resolver: zodResolver(newPatientSchema),
  })

  const [searchPlace] = useLazyGetAutocompleteQuery();
  const { data: classes } = useListClassesQuery()

  const onSubmit = (data: z.infer<typeof newPatientSchema>) => {
    console.log(data)
  }

  const handleSearchPlace = async (query?: string) => {
    if (!query) return [];
    try {
      const place = await searchPlace(query).unwrap();
      return place.predictions.map((prediction) => ({
        formatted_address: prediction.description,
        place_id: prediction.place_id,
      }));
    } catch (error) {
      console.error("Error al buscar lugar:", error);
      return [];
    }
  }

  const isCompany = useWatch({
    control: newPatientForm.control,
    name: "fiscal.customer_type",
  }) === "company"

  console.log(newPatientForm.watch())

  return (
    <>
      <Header title="Nuevo paciente">
        <Button
          type="submit"
          onClick={newPatientForm.handleSubmit(onSubmit)}
          size="sm"
          className="ml-auto"
        >
          Crear paciente
        </Button>
      </Header>
      <div className="flex flex-col h-full justify-between">
        <Form {...newPatientForm}>
          <form onSubmit={newPatientForm.handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">General</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newPatientForm.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Nombre(s)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Juan"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="first_last_name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Apellido(s)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Pérez"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/*                 <FormField
                  control={newPatientForm.control}
                  name="link_type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Tipo de vinculación</FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between font-normal pl-3",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? LINK_TYPES.find(
                                  (language) => language.value === field.value
                                )?.label
                                : "Seleccionar tipo de vinculación"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0">
                          <Command>
                            <CommandInput
                              placeholder="Buscar..."
                              className="h-8"
                            />
                            <CommandList>
                              <CommandEmpty>No se encontraron resultados</CommandEmpty>
                              <CommandGroup>
                                {LINK_TYPES.map((type) => (
                                  <CommandItem
                                    value={type.label}
                                    key={type.value}
                                    onSelect={() => {
                                      newPatientForm.setValue("link_type", type.value)
                                    }}
                                  >
                                    {type.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        type.value === field.value
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
                      {newPatientForm.formState.errors.link_type ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Este será el tipo de vinculación del cliente que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={newPatientForm.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Sexo biológico</FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between font-normal pl-3",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? BIOLOGICAL_SEX_TYPES.find(
                                  (language) => language.value === field.value
                                )?.label
                                : "Seleccionar sexo biológico"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0">
                          <Command>
                            <CommandInput
                              placeholder="Buscar..."
                              className="h-8"
                            />
                            <CommandList>
                              <CommandEmpty>No se encontraron resultados</CommandEmpty>
                              <CommandGroup>
                                {BIOLOGICAL_SEX_TYPES.map((type) => (
                                  <CommandItem
                                    value={type.label}
                                    key={type.value}
                                    onSelect={() => {
                                      newPatientForm.setValue("sex", type.value)
                                    }}
                                  >
                                    {type.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        type.value === field.value
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="gender_identity"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Identidad de género</FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between font-normal pl-3",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? GENDER_IDENTITY_TYPES.find(
                                  (type) => type.value === field.value
                                )?.label
                                : "Seleccionar identidad de género"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0">
                          <Command>
                            <CommandInput
                              placeholder="Buscar..."
                              className="h-8"
                            />
                            <CommandList>
                              <CommandEmpty>No se encontraron resultados</CommandEmpty>
                              <CommandGroup>
                                {GENDER_IDENTITY_TYPES.map((type) => (
                                  <CommandItem
                                    value={type.label}
                                    key={type.value}
                                    onSelect={() => {
                                      newPatientForm.setValue("gender_identity", type.value)
                                    }}
                                  >
                                    {type.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        type.value === field.value
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/*              <FormField
                  control={newPatientForm.control}
                  name="birthdate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de nacimiento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>
                                  Seleccionar fecha de nacimiento
                                </span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {newPatientForm.formState.errors.birthdate ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Esta será la fecha de nacimiento del cliente que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={newPatientForm.control}
                  name="birth_place"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Lugar de nacimiento</FormLabel>
                      <FormControl>
                        <AsyncSelect<{ formatted_address: string, place_id: string }, { formatted_address: string, place_id: string }>
                          label="Lugar de nacimiento"
                          triggerClassName="!w-full"
                          placeholder="Seleccionar lugar de nacimiento"
                          fetcher={handleSearchPlace}
                          getDisplayValue={(item) => item.formatted_address}
                          getOptionValue={(item) => item}
                          renderOption={(item) => <div>{item.formatted_address}</div>}
                          onChange={field.onChange}
                          value={field.value}
                          getOptionKey={(item) => item.place_id}
                          noResultsMessage="No se encontraron resultados"
                          modal
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Dirección de residencia</FormLabel>
                      <FormControl>
                        <AsyncSelect<{ formatted_address: string, place_id: string }, { formatted_address: string, place_id: string }>
                          label="Dirección de residencia"
                          triggerClassName="!w-full"
                          placeholder="Seleccionar dirección de residencia"
                          fetcher={handleSearchPlace}
                          getDisplayValue={(item) => item.formatted_address}
                          getOptionValue={(item) => item}
                          renderOption={(item) => <div>{item.formatted_address}</div>}
                          onChange={field.onChange}
                          value={field.value}
                          getOptionKey={(item) => item.place_id}
                          noResultsMessage="No se encontraron resultados"
                          modal
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="disability_type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full mt-0.5">
                      <FormLabel className="w-fit">Discapacidad</FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between font-normal pl-3",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? DISABILITY_TYPES.find(
                                  (type) => type.value === field.value
                                )?.label
                                : "Seleccionar tipo de discapacidad"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0">
                          <Command>
                            <CommandInput
                              placeholder="Buscar..."
                              className="h-8"
                            />
                            <CommandList>
                              <CommandEmpty>No se encontraron resultados</CommandEmpty>
                              <CommandGroup>
                                {DISABILITY_TYPES.map((type) => (
                                  <CommandItem
                                    value={type.label}
                                    key={type.value}
                                    onSelect={() => {
                                      newPatientForm.setValue("disability_type", type.value)
                                    }}
                                  >
                                    {type.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        type.value === field.value
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/*                 <FormField
                  control={newPatientForm.control}
                  name="headquarter_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Sede</FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between font-normal pl-3",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? HEADQUARTERS.find(
                                  (language) => language.value === field.value
                                )?.label
                                : "Seleccionar sede"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0">
                          <Command>
                            <CommandInput
                              placeholder="Buscar sede"
                              className="h-8"
                            />
                            <CommandList>
                              <CommandEmpty>No se encontraron resultados</CommandEmpty>
                              <CommandGroup>
                                {HEADQUARTERS.map((headquarter) => (
                                  <CommandItem
                                    value={headquarter.label}
                                    key={headquarter.value}
                                    onSelect={() => {
                                      newPatientForm.setValue("headquarter_id", headquarter.value)
                                    }}
                                  >
                                    {headquarter.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        headquarter.value === field.value
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
                      {newPatientForm.formState.errors.headquarter_id ? (
                        <FormMessage />
                      ) :
                        <FormDescription>
                          Este será la sede a la que estará vinculado el cliente.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={newPatientForm.control}
                  name="document_type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Tipo de documento</FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between font-normal pl-3",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? DOCUMENT_TYPES.find(
                                  (language) => language.value === field.value
                                )?.label
                                : "Seleccionar tipo de documento"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0">
                          <Command>
                            <CommandInput
                              placeholder="Buscar..."
                              className="h-8"
                            />
                            <CommandList>
                              <CommandEmpty>No se encontraron resultados</CommandEmpty>
                              <CommandGroup>
                                {DOCUMENT_TYPES.map((type) => (
                                  <CommandItem
                                    value={type.label}
                                    key={type.value}
                                    onSelect={() => {
                                      newPatientForm.setValue("document_type", type.value)
                                    }}
                                  >
                                    {type.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        type.value === field.value
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="document_number"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Número de documento</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="1234567890"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Número de teléfono</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="+1 123 456 7890"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="class_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Clase</FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between font-normal pl-3",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? classes?.data?.find((c) => c.id === field.value)?.name : "Seleccionar clase"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0">
                          <Command>
                            <CommandInput
                              placeholder="Buscar..."
                              className="h-8"
                            />
                            <CommandList>
                              <CommandEmpty>No se encontraron resultados</CommandEmpty>
                              <CommandGroup>
                                {classes?.data?.map((c) => (
                                  <CommandItem
                                    value={c.name}
                                    key={c.id}
                                    onSelect={() => {
                                      newPatientForm.setValue("class_id", c.id)
                                    }}
                                  >
                                    {c.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        c.id === field.value
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />
            {/*             <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Acompañante</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newPatientForm.control}
                  name="partner_first_name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Nombre(s)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Juan"
                        />
                      </FormControl>
                      <FormDescription>
                        Este será el nombre del acompañante del cliente que se registrará.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="partner_last_name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Apellido(s)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Pérez"
                        />
                      </FormControl>
                      <FormDescription>
                        Este será el apellido del acompañante del cliente que se registrará.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="partner_residence_address"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Dirección de residencia</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Calle 123 # 123-45"
                        />
                      </FormControl>
                      <FormDescription>
                        Este será la dirección de residencia del acompañante del cliente que se registrará.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="partner_residence_city_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Ciudad de residencia</FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between font-normal pl-3",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? CITIES.find(
                                  (class) => language.value === field.value
                                )?.label
                                : "Seleccionar ciudad de residencia"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0">
                          <Command>
                            <CommandInput
                              placeholder="Buscar..."
                              className="h-8"
                            />
                            <CommandList>
                              <CommandEmpty>No se encontraron resultados</CommandEmpty>
                              <CommandGroup>
                                {CITIES.map((city) => (
                                  <CommandItem
                                    value={city.label}
                                    key={city.value}
                                    onSelect={() => {
                                      newPatientForm.setValue("partner_residence_city_id", city.value)
                                    }}
                                  >
                                    {city.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        city.value === field.value
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
                      <FormDescription>
                        Este será la ciudad de residencia del acompañante del cliente que se registrará.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Parentesco</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Seleccionar parentesco"
                        />
                      </FormControl>
                      <FormDescription>
                        Este será el parentesco del acompañante del cliente que se registrará.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Responsable</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newPatientForm.control}
                  name="responsible_first_name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Nombre(s)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Juan"
                        />
                      </FormControl>
                      <FormDescription>
                        Este será el nombre del responsable del cliente que se registrará.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="responsible_last_name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Apellido(s)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Pérez"
                        />
                      </FormControl>
                      <FormDescription>
                        Este será el apellido del responsable del cliente que se registrará.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="responsible_residence_address"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Dirección de residencia</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Calle 123 # 123-45"
                        />
                      </FormControl>
                      <FormDescription>
                        Este será la dirección de residencia del responsable del cliente que se registrará.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="responsible_phone_number"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Número de teléfono</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="+1 123 456 7890"
                        />
                      </FormControl>
                      <FormDescription>
                        Este será el número de teléfono del responsable del cliente que se registrará.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="responsible_document_type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Tipo de documento</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Cédula de ciudadanía"
                        />
                      </FormControl>
                      <FormDescription>
                        Este será el tipo de documento del responsable del cliente que se registrará.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="responsible_document_number"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Número de documento</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="1234567890"
                        />
                      </FormControl>
                      <FormDescription>
                        Este será el número de documento del responsable del cliente que se registrará.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="responsible_relationship"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Parentesco</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Seleccionar parentesco"
                        />
                      </FormControl>
                      <FormDescription>
                        Este será el parentesco del responsable del cliente que se registrará.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div> */}
            {/* <Separator /> */}
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Fiscal</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newPatientForm.control}
                  name="fiscal.customer_type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Tipo de cliente
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo de cliente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="company">
                              Empresa
                            </SelectItem>
                            <SelectItem value="individual">
                              Particular
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="fiscal.registered_name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Razón social</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isCompany}
                          placeholder="Guantes S.A."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="fiscal.tax_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Número de identificación fiscal</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="30-12345678-9"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newPatientForm.control}
                  name="fiscal.fiscal_category"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Condición frente al IVA
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Condición frente al IVA" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="responsable_inscripto">
                              Responsable inscripto
                            </SelectItem>
                            <SelectItem value="monotributista">
                              Monotributista
                            </SelectItem>
                            <SelectItem value="exento">
                              Exento
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
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