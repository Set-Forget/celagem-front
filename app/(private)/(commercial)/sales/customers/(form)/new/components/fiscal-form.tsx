import { AsyncSelect } from "@/components/async-select"
import SearchSelect from "@/components/search-select"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useLazyListEconomicActivitiesQuery } from "@/lib/services/economic_activities"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { entity_type, fiscal_responsibility, nationality_type, tax_category, tax_information, tax_regime, tax_type } from "../data"
import { newCustomerSchema } from "../../../schema/customers"
import { useSendMessageMutation } from "@/lib/services/telegram"

export default function FiscalForm() {
  const { control, formState } = useFormContext<z.infer<typeof newCustomerSchema>>()

  const [sendMessage] = useSendMessageMutation();
  const [searchEconomicActivities] = useLazyListEconomicActivitiesQuery()

  const handleEconomicActivity = async (query?: string) => {
    try {
      const response = await searchEconomicActivities({ name: query }).unwrap()
      return response.data?.map(activity => ({
        id: activity.id,
        name: activity.name,
        code: activity.code
      }))
    }
    catch (error) {
      sendMessage({
        location: "app/(private)/(commercial)/sales/customers/(form)/new/components/fiscal-form.tsx",
        rawError: error,
        fnLocation: "handleEconomicActivity"
      }).unwrap().catch((error) => {
        console.error(error);
      });
      return []
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="tax_type"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Tipo de documento
            </FormLabel>
            <FormControl>
              <SearchSelect
                value={field.value}
                onSelect={field.onChange}
                options={tax_type}
                placeholder="Selecciona un tipo de documento..."
                searchPlaceholder="Buscar..."
              />
            </FormControl>
            {formState.errors.tax_type ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el tipo de documento del cliente.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
            {formState.errors.tax_id ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el número de identificación fiscal del cliente.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="tax_regime"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Regimen tributario
            </FormLabel>
            <FormControl>
              <SearchSelect
                value={field.value}
                onSelect={field.onChange}
                options={tax_regime}
                placeholder="Selecciona un regimen tributario..."
                searchPlaceholder="Buscar..."
              />
            </FormControl>
            {formState.errors.tax_regime ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el regimen tributario del cliente.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="tax_category"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Regimen fiscal
            </FormLabel>
            <FormControl>
              <SearchSelect
                value={field.value}
                onSelect={field.onChange}
                options={tax_category}
                placeholder="Selecciona un regimen fiscal..."
                searchPlaceholder="Buscar..."
              />
            </FormControl>
            {formState.errors.tax_category ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el regimen fiscal del cliente.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="tax_information"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Información tributaria
            </FormLabel>
            <FormControl>
              <SearchSelect
                value={field.value}
                onSelect={field.onChange}
                options={tax_information}
                placeholder="Selecciona una información tributaria..."
                searchPlaceholder="Buscar..."
              />
            </FormControl>
            {formState.errors.tax_information ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será la información tributaria del cliente.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="fiscal_responsibility"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Responsabilidad fiscal
            </FormLabel>
            <FormControl>
              <SearchSelect
                value={field.value}
                onSelect={field.onChange}
                options={fiscal_responsibility}
                placeholder="Selecciona una responsabilidad fiscal..."
                searchPlaceholder="Buscar..."
              />
            </FormControl>
            {formState.errors.fiscal_responsibility ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será la responsabilidad fiscal del cliente.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="economic_activity"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Actividad económica</FormLabel>
            <AsyncSelect<{ id: number, name: string, code: string }, number>
              label="Actividad económica"
              triggerClassName="!w-full"
              placeholder="Seleccionar cuenta contable..."
              fetcher={handleEconomicActivity}
              getDisplayValue={(item) => `${item.code} - ${item.name}`}
              getOptionValue={(item) => item.id}
              renderOption={(item) => <div>{item.code} - {item.name}</div>}
              onChange={field.onChange}
              value={field.value}
              getOptionKey={(item) => String(item.id)}
              noResultsMessage="No se encontraron resultados"
            />
            {formState.errors.economic_activity ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la actividad económica del cliente.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="entity_type"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Tipo de persona
            </FormLabel>
            <FormControl>
              <SearchSelect
                value={field.value}
                onSelect={field.onChange}
                options={entity_type}
                placeholder="Selecciona un tipo de persona..."
                searchPlaceholder="Buscar..."
              />
            </FormControl>
            {formState.errors.entity_type ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el tipo de persona del cliente.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="nationality_type"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Tipo de nacionalidad
            </FormLabel>
            <FormControl>
              <SearchSelect
                value={field.value}
                onSelect={field.onChange}
                options={nationality_type}
                placeholder="Selecciona un tipo de nacionalidad..."
                searchPlaceholder="Buscar..."
              />
            </FormControl>
            {formState.errors.nationality_type ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el tipo de nacionalidad del cliente.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
              Este campo indica si el cliente es residente.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  )
}