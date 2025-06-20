import { AsyncSelect } from "@/components/async-select";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccountingAccountSelect } from "@/hooks/use-account-select";
import { useCompanySelect } from "@/hooks/use-company-select";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { newPaymentMethodSchema } from "../schema/payment-methods";
import { paymentTypes } from "../utils";

export default function NewPaymentMethodForm({ isEditing }: { isEditing?: boolean }) {
  const { control, formState } = useFormContext<z.infer<typeof newPaymentMethodSchema>>()

  const { fetcher: handleSearchCompany } = useCompanySelect()
  const { fetcher: handleSearchAccount } = useAccountingAccountSelect()

  return (
    <form className="gap-4 grid grid-cols-2">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Nombre</FormLabel>
            <FormControl>
              <Input
                placeholder="Efectivo"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="payment_type"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Tipo de pago
            </FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ingreso" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(paymentTypes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/*       <FormField
          control={control}
          name="company"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Compañía</FormLabel>
              <FormControl>
                <AsyncSelect<{ id: number, name: string }, number>
                  label="Compañía"
                  triggerClassName="!w-full"
                  placeholder="Seleccionar compañía..."
                  fetcher={handleSearchCompany}
                  getDisplayValue={(item) => item.name}
                  getOptionValue={(item) => item.id}
                  renderOption={(item) => <div>{item.name}</div>}
                  onChange={field.onChange}
                  value={field.value}
                  getOptionKey={(item) => item.id.toString()}
                  noResultsMessage="No se encontraron resultados"
                  modal
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
      <FormField
        control={control}
        name="payment_account"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Cuenta de pago</FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string }, number>
                label="Cuenta de pago"
                triggerClassName="!w-full"
                placeholder="Seleccionar cuenta de pago..."
                fetcher={handleSearchAccount}
                getDisplayValue={(item) => item.name}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.name}</div>}
                onChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => item.id.toString()}
                noResultsMessage="No se encontraron resultados"
                modal
              />
            </FormControl>
            {formState.errors.payment_account ? (
              <FormMessage />
            ) : (
              <FormDescription>
                Cuenta contable de pago.
              </FormDescription>
            )}
          </FormItem>
        )}
      />
    </form>
  )
}