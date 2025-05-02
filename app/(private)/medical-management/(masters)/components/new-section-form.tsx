import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { newSectionSchema } from "../schemas/templates";
import { sectionTypes } from "../sections/utils";

export default function NewSectionForm() {
  const { control } = useFormContext<z.infer<typeof newSectionSchema>>();

  return (
    <div className="grid grid-cols-1 gap-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nombre de la sección" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="font-normal">Descripción</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Breve descripción" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel>Tipo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo de sección" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {sectionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}