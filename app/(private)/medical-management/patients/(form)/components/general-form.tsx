import { AsyncSelect } from "@/components/async-select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useLazyGetAutocompleteQuery } from "@/lib/services/google-places"
import { useLazyListClassesQuery, useLazyListCompaniesQuery } from "@/lib/services/users"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newPatientSchema } from "../../schema/patients"
import { biologicalSexTypes, disabilityTypes, documentTypes, genderIdentityTypes, linkageTypes, maritalStatusTypes } from "../../utils"

export default function GeneralForm() {
  const { setValue, control } = useFormContext<z.infer<typeof newPatientSchema>>()

  const [getCompanies] = useLazyListCompaniesQuery()
  const [getClasses] = useLazyListClassesQuery()
  const [searchPlace] = useLazyGetAutocompleteQuery();

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

  const handleGetCompanies = async () => {
    try {
      const companies = await getCompanies().unwrap()
      return companies.data.map((company) => ({
        label: company.name,
        value: company.id,
      }))
    } catch (error) {
      console.error("Error al obtener la sede:", error)
      return []
    }
  }

  const handleGetClasses = async () => {
    try {
      const classes = await getClasses().unwrap()
      return classes.data.map((company) => ({
        label: company.name,
        value: company.id,
      }))
    } catch (error) {
      console.error("Error al obtener la clase:", error)
      return []
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="first_name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Nombre(s)</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="Nombre del paciente"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="first_last_name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Apellido(s)</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="Appelido del paciente"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="biological_sex"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Sexo biológico</FormLabel>
            <Popover>
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
                      ? biologicalSexTypes.find(
                        (type) => type.value === field.value
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
                      {biologicalSexTypes.map((type) => (
                        <CommandItem
                          value={type.label}
                          key={type.value}
                          onSelect={() => {
                            setValue("biological_sex", type.value, { shouldValidate: true })
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
        control={control}
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
                      ? genderIdentityTypes.find(
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
                      {genderIdentityTypes.map((type) => (
                        <CommandItem
                          value={type.label}
                          key={type.value}
                          onSelect={() => {
                            setValue("gender_identity", type.value, { shouldValidate: true })
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
        control={control}
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
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
                noResultsMessage="Podrías ingresar 'Bogotá, Colombia'"
                initialOptions={field.value ? [field.value] : []}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
                noResultsMessage="Podrías ingresar 'Calle 123, Bogotá, Colombia'"
                initialOptions={field.value ? [field.value] : []}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="marital_status"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Estado civil</FormLabel>
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
                      ? maritalStatusTypes.find(
                        (type) => type.value === field.value
                      )?.label
                      : "Seleccionar estado civil"}
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
                      {maritalStatusTypes.map((type) => (
                        <CommandItem
                          value={type.label}
                          key={type.value}
                          onSelect={() => {
                            setValue("marital_status", type.value, { shouldValidate: true })
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
        control={control}
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
                      ? disabilityTypes.find(
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
                      {disabilityTypes.map((type) => (
                        <CommandItem
                          value={type.label}
                          key={type.value}
                          onSelect={() => {
                            setValue("disability_type", type.value)
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
        control={control}
        name="company_id"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel>Sede</FormLabel>
            <FormControl>
              <AsyncSelect<{ label: string, value: string }, string>
                label="Sede"
                triggerClassName="!w-full"
                placeholder="Seleccionar sede"
                fetcher={handleGetCompanies}
                getDisplayValue={(item) => item.label}
                getOptionValue={(item) => item.value}
                renderOption={(item) => <div>{item.label}</div>}
                onChange={field.onChange}
                value={field.value}
                noResultsMessage="No se encontraron sedes"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
                      ? documentTypes.find(
                        (type) => type.value === field.value
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
                      {documentTypes.map((type) => (
                        <CommandItem
                          value={type.label}
                          key={type.value}
                          onSelect={() => {
                            setValue("document_type", type.value, { shouldValidate: true })
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
        control={control}
        name="document_number"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Número de documento</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="1234567890"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="phone_number"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Número de teléfono</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="+1 123 456 7890"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Correo electrónico</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="ventas@guantes.com"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="father_name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Nombre del padre</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="Nombre del padre"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="mother_name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Nombre de la madre</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="Nombre de la madre"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="class_id"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Clase</FormLabel>
            <AsyncSelect<{ label: string, value: string }, string>
              label="Clase"
              triggerClassName="!w-full"
              placeholder="Seleccionar clase"
              fetcher={handleGetClasses}
              getDisplayValue={(item) => item.label}
              getOptionValue={(item) => item.value}
              renderOption={(item) => <div>{item.label}</div>}
              onChange={field.onChange}
              value={field.value}
              noResultsMessage="No se encontraron clases"
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="referring_entity"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Entidad/IPS remitente</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="Nombre de la entidad o IPS"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="linkage"
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
                      ? linkageTypes.find(
                        (type) => type.value === field.value
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
                      {linkageTypes.map((type) => (
                        <CommandItem
                          value={type.label}
                          key={type.value}
                          onSelect={() => {
                            setValue("linkage", type.value, { shouldValidate: true })
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
    </div>
  )
}