import { AsyncSelect } from "@/components/async-select"
import DatePicker from "@/components/date-picker"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useLazyGetAutocompleteQuery } from "@/lib/services/google-places"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newPatientSchema } from "../../schema/patients"
import { biologicalSexTypes, disabilityTypes, documentTypes, genderIdentityTypes, maritalStatusTypes } from "../../utils"
import { useSendMessageMutation } from "@/lib/services/telegram"

export default function GeneralForm() {
  const { setValue, control } = useFormContext<z.infer<typeof newPatientSchema>>()

  const [sendMessage] = useSendMessageMutation()
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
      sendMessage({
        location: "app/(private)/medical-management/patients/(form)/components/general-form.tsx",
        rawError: error,
        fnLocation: "handleSearchPlace"
      }).unwrap().catch((error) => {
        console.error(error);
      });
      return [];
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
                placeholder="Jhon"
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
                placeholder="Doe"
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
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Fecha de nacimiento</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value || null}
                onChange={(date) => field.onChange(date)}
              />
            </FormControl>
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
            <FormLabel className="w-fit">Discapacidad (Opcional)</FormLabel>
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
    </div>
  )
}