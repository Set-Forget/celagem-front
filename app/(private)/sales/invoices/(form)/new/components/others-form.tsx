import { AsyncSelect } from "@/components/async-select"
import DatePicker from "@/components/date-picker"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useLazyListAccountingAccountsQuery } from "@/lib/services/accounting-accounts"
import { useLazyListCostCentersQuery } from "@/lib/services/cost-centers"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newInvoiceSchema } from "../../../schemas/invoices"

export default function OthersForm() {
  const { control, formState } = useFormContext<z.infer<typeof newInvoiceSchema>>()

  const [searchCostCenters] = useLazyListCostCentersQuery()
  const [searchAccountingAccounts] = useLazyListAccountingAccountsQuery()

  const handleSearchAccountingAccount = async (query?: string) => {
    try {
      const response = await searchAccountingAccounts({ name: query }).unwrap()
      return response.data?.map(account => ({
        id: account.id,
        name: account.name,
        code: account.code
      }))
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  const handleSearchCostCenters = async (query?: string) => {
    try {
      const response = await searchCostCenters({ name: query }).unwrap()
      return response.data?.map(c => ({
        id: c.id,
        name: c.name
      }))
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
        name="cost_center"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Centro de costos</FormLabel>
            <AsyncSelect<{ id: number, name: string }, number | undefined>
              label="Centro de costos"
              triggerClassName="!w-full"
              placeholder="Seleccionar centro de costos"
              fetcher={handleSearchCostCenters}
              getDisplayValue={(item) => item.name}
              getOptionValue={(item) => item.id}
              renderOption={(item) => <div>{item.name}</div>}
              onChange={field.onChange}
              value={field.value}
              getOptionKey={(item) => String(item.id)}
              noResultsMessage="No se encontraron resultados"
            />
            {formState.errors.cost_center ? (
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
        control={control}
        name="accounting_date"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Fecha de contabilización</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value || null}
                onChange={(date) => field.onChange(date)}
              />
            </FormControl>
            {formState.errors.accounting_date ? (
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
        control={control}
        name="accounting_account"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Cuenta contable</FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string, code: string }, number>
                label="Cuenta contable"
                triggerClassName="!w-full"
                placeholder="Buscar cuenta contable..."
                fetcher={handleSearchAccountingAccount}
                getDisplayValue={(item) => `${item.code} - ${item.name}`}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.code} - {item.name}</div>}
                onChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => String(item.id)}
                noResultsMessage="No se encontraron resultados"
              />
            </FormControl>
            {formState.errors.accounting_account ? (
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
        control={control}
        name="internal_notes"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full col-span-2">
            <FormLabel className="w-fit">Notas</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Notas..."
              />
            </FormControl>
            {formState.errors.internal_notes ? (
              <FormMessage />
            ) :
              <FormDescription>
                Estas notas son internas y no se incluirán en la factura.
              </FormDescription>
            }
          </FormItem>
        )}
      />
    </div>
  )
}