import { AsyncMultiSelect } from "@/components/async-multi-select"
import { AsyncSelect } from "@/components/async-select"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useLazyListBusinessUnitsQuery } from "@/lib/services/business-units"
import { useLazyListClassesQuery } from "@/lib/services/classes"
import { useLazyListCompaniesQuery } from "@/lib/services/companies"
import { useGetPatientQuery } from "@/lib/services/patients"
import { useSendMessageMutation } from "@/lib/services/telegram"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newPatientSchema } from "../../schema/patients"
import { linkageTypes } from "../../utils"

export default function AffiliationForm() {
  const { id } = useParams<{ id: string }>();

  const { setValue, control } = useFormContext<z.infer<typeof newPatientSchema>>()

  const { data: patient } = useGetPatientQuery(id, { skip: !id })

  const [sendMessage] = useSendMessageMutation()
  const [getCompanies] = useLazyListCompaniesQuery()
  const [getClasses] = useLazyListClassesQuery()
  const [getBusinessUnits] = useLazyListBusinessUnitsQuery()

  const handleGetCompanies = async () => {
    try {
      const companies = await getCompanies().unwrap()
      return companies.data.map((company) => ({
        label: company.name,
        value: company.id,
      }))
    } catch (error) {
      sendMessage({
        location: "app/(private)/medical-management/patients/(form)/components/affiliation-form.tsx",
        rawError: error,
        fnLocation: "handleGetCompanies"
      })
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
      sendMessage({
        location: "app/(private)/medical-management/patients/(form)/components/affiliation-form.tsx",
        rawError: error,
        fnLocation: "handleGetClasses"
      })
      return []
    }
  }

  const handleGetBusinessUnits = async () => {
    try {
      const businessUnits = await getBusinessUnits().unwrap()
      return businessUnits.data.map((bu) => ({
        label: bu.name,
        value: bu.id,
      }))
    } catch (error) {
      sendMessage({
        location: "app/(private)/medical-management/patients/(form)/components/affiliation-form.tsx",
        rawError: error,
        fnLocation: "handleGetBusinessUnits"
      })
      return []
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
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
        name="company_id"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel>Compañia</FormLabel>
            <FormControl>
              <AsyncSelect<{ label: string, value: string }, string>
                label="Compañia"
                triggerClassName="!w-full"
                placeholder="Seleccionar compañia"
                fetcher={handleGetCompanies}
                getDisplayValue={(item) => item.label}
                getOptionValue={(item) => item.value}
                renderOption={(item) => <div>{item.label}</div>}
                onChange={field.onChange}
                value={field.value}
                noResultsMessage="No se encontraron compañias"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="clinics"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel>Sedes</FormLabel>
            <FormControl>
              <AsyncMultiSelect<{ label: string, value: string }, string>
                placeholder="Seleccionar sedes"
                fetcher={handleGetBusinessUnits}
                getDisplayValue={(item) => item.label}
                getOptionValue={(item) => item.value}
                renderOption={(item) => <div>{item.label}</div>}
                onValueChange={field.onChange}
                value={field.value}
                noResultsMessage="No se encontraron sedes"
                variant="secondary"
                defaultValue={field.value}
                initialOptions={patient?.clinics.map((clinic) => ({ label: clinic.name, value: clinic.id }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="insurance_provider"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Aseguradora</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="Nombre de la aseguradora"
              />
            </FormControl>
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