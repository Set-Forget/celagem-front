import { AsyncSelect } from "@/components/async-select";
import DatePicker from "@/components/date-picker";
import FormTable from "@/components/form-table";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { newPurchaseRequestSchema } from "../../../schemas/purchase-requests";
import { columns } from "./columns";
import TableFooter from "./table-footer";
import { useLazyListCompaniesQuery } from "@/lib/services/companies";
import { getLocalTimeZone, today } from "@internationalized/date";

export default function GeneralForm() {
  const { control, formState } = useFormContext<z.infer<typeof newPurchaseRequestSchema>>()

  const [searchCompanies] = useLazyListCompaniesQuery()

  const handleSearchCompany = async (query?: string) => {
    try {
      const response = await searchCompanies({ name: query }).unwrap()
      return response.data?.map(company => ({
        id: company.id,
        name: company.name
      }))
        .slice(0, 10)
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="request_date"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Fecha de requerimiento</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value || null}
                onChange={(date) => field.onChange(date)}
                isDateUnavailable={(date) => date.compare(today(getLocalTimeZone())) < 0}
              />
            </FormControl>
            {formState.errors.request_date ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la fecha en la que se requiere la compra.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="company"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Compañía</FormLabel>
            <AsyncSelect<{ id: string, name: string }, string>
              label="Compañía"
              triggerClassName="!w-full"
              placeholder="Seleccionar compañia..."
              fetcher={handleSearchCompany}
              getDisplayValue={(item) => item.name}
              getOptionValue={(item) => item.id}
              renderOption={(item) => <div>{item.name}</div>}
              onChange={field.onChange}
              value={field.value}
              getOptionKey={(item) => String(item.id)}
              noResultsMessage="No se encontraron resultados"
            />
            {formState.errors.company ? (
              <FormMessage />
            ) :
              <FormDescription>
                Compañia desde la cual se generará la solicitud de compra.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="items"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full col-span-2">
            <FormLabel className="w-fit">Items</FormLabel>
            <FormControl>
              <FormTable<z.infer<typeof newPurchaseRequestSchema>>
                columns={columns}
                footer={({ append }) => <TableFooter append={append} />}
                name="items"
                className="col-span-2"
              />
            </FormControl>
            {formState.errors.items?.message && (
              <p className="text-destructive text-[12.8px] mt-1 font-medium">
                {formState.errors.items.message}
              </p>
            )}
          </FormItem>
        )}
      />
    </div>
  )
}