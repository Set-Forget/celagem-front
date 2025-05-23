import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newCreditNoteSchema } from "../../../schemas/credit-notes"

export default function NotesForm() {
  const { control } = useFormContext<z.infer<typeof newCreditNoteSchema>>()

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="internal_notes"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full md:col-span-2">
            <FormLabel className="w-fit">Notas</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Notas internas..."
                className="resize-none"
              />
            </FormControl>
            <FormDescription>
              Estas notas son internas y no se incluirán en la nota de crédito.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  )
}