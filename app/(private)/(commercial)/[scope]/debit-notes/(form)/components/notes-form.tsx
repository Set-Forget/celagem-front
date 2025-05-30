import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newDebitNoteSchema } from "../../schemas/debit-notes"

export default function NotesForm() {
  const { control } = useFormContext<z.infer<typeof newDebitNoteSchema>>()

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
              Estas notas son internas y no se incluirán en la nota de débito.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="tyc_notes"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full md:col-span-2">
            <FormLabel className="w-fit">
              Términos y condiciones
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Términos y condiciones..."
                className="resize-none"
              />
            </FormControl>
            <FormDescription>
              Estos términos y condiciones se incluirán en la nota de débito.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  )
}