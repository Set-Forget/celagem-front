import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newCustomerSchema } from "../../../schema/customers"

export default function GeneralForm() {
  const { control, formState } = useFormContext<z.infer<typeof newCustomerSchema>>()

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
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
            {formState.errors.name ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el nombre del cliente.
              </FormDescription>
            }
          </FormItem>
        )}
      />
    </div>
  )
}