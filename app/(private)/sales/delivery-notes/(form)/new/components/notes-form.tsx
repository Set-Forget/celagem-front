import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newDeliveryNoteSchema } from "../../../schemas/delivery-notes"

export default function NotesForm() {
  const { control } = useFormContext<z.infer<typeof newDeliveryNoteSchema>>()

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full md:col-span-2">
            <FormLabel className="w-fit">Notas</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Notas..."
                className="resize-none"
              />
            </FormControl>
            <FormDescription>
              Estas notas serán visibles en el remito.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  )
}