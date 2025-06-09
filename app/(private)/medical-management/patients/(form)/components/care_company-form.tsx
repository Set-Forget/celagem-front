import { AsyncSelect } from "@/components/async-select"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLazyListCareCompaniesQuery } from "@/lib/services/patients"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newPatientSchema } from "../../schema/patients"
import { useSendMessageMutation } from "@/lib/services/telegram"

export default function CareCompanyForm() {
  const { control } = useFormContext<z.infer<typeof newPatientSchema>>()

  const [sendMessage] = useSendMessageMutation()
  const [getCareCompanies] = useLazyListCareCompaniesQuery()

  const handleGetCareCompanies = async () => {
    try {
      const companies = await getCareCompanies().unwrap()
      return companies.data.map((company) => ({
        label: company.name,
        value: company.id,
      }))
    } catch (error) {
      sendMessage({
        location: "app/(private)/medical-management/patients/(form)/components/care_company-form.tsx",
        rawError: error,
        fnLocation: "handleGetCareCompanies"
      })
      return []
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="care_company_plan.care_company_id"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel>Empresa</FormLabel>
            <FormControl>
              <AsyncSelect<{ label: string, value: string }, string>
                label="Empresa"
                triggerClassName="!w-full"
                placeholder="Seleccionar empresa"
                fetcher={handleGetCareCompanies}
                getDisplayValue={(item) => item.label}
                getOptionValue={(item) => item.value}
                renderOption={(item) => <div>{item.label}</div>}
                onChange={field.onChange}
                value={field.value}
                noResultsMessage="No se encontraron empresas"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="care_company_plan.contract_number"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Contrato</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="Número de contrato"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="care_company_plan.coverage"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Plan de cobertura
            </FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Plan de cobertura" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="particular">
                    Particular
                  </SelectItem>
                  <SelectItem value="native">
                    PL nativo
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}