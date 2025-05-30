import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newSupplierSchema } from "../../../schema/suppliers"

export default function GeneralForm() {
  const { control, formState } = useFormContext<z.infer<typeof newSupplierSchema>>()

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
                Este será el nombre del proveedor.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="legal_name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Razón social</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Celagem S.A.S."
              />
            </FormControl>
            {formState.errors.legal_name ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la razón social del proveedor.
              </FormDescription>
            }
          </FormItem>
        )}
      />
    </div>
  )
}