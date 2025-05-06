import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "emblor";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { newCustomerSchema } from "../../../schema/customers";

export default function OthersForm() {
  const { control } = useFormContext<z.infer<typeof newCustomerSchema>>();
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <FormField
        control={control}
        name="tags"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full col-span-2">
            <FormLabel className="w-fit">Etiquetas</FormLabel>
            <FormControl>
              <TagInput
                tags={field.value}
                setTags={(newTags) => {
                  field.onChange(newTags)
                }}
                placeholder="Añadir etiquetas..."
                styleClasses={{
                  inlineTagsContainer:
                    "border-input rounded-sm bg-background shadow-sm transition-[color,box-shadow] focus-within:border-ring outline-none p-1 gap-1",
                  input: "w-full min-w-[80px] shadow-none px-2 h-7",
                  tag: {
                    body: "h-7 relative bg-background border border-input hover:bg-background rounded-sm font-medium text-xs ps-2 pe-7",
                    closeButton:
                      "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                  },
                }}
                activeTagIndex={activeTagIndex}
                setActiveTagIndex={setActiveTagIndex}
              />
            </FormControl>
            <FormDescription>
              Las etiquetas son útiles para organizar y filtrar los clientes.
            </FormDescription>
          </FormItem>
        )}
      />
      {/* 
        // ! Las notas deberían ser un array.
      */}
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
            <FormDescription>
              Estas notas son internas.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  )
}