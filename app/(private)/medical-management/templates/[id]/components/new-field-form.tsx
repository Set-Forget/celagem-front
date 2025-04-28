import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useFormContext, useWatch } from "react-hook-form";
import { propFieldAdapter } from "../utils";
import PropField from "./prop-field";
import { newFieldSchema } from "../../../calendar/schemas/templates";
import { z } from "zod";
import { fieldTypes, propertiesByType } from "../../utils";

export default function NewFieldForm() {
  const { control, setValue } = useFormContext<z.infer<typeof newFieldSchema>>();

  const selectedType = useWatch({ control, name: "type.primitive_type" });
  const properties = selectedType ? propertiesByType[selectedType] ?? [] : [];

  return (
    <div className="grid grid-cols-1 gap-4">
      <FormField
        control={control}
        name="type.primitive_type"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Tipo de campo</FormLabel>
            <Popover modal>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "justify-between font-normal pl-3",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <p className="truncate">
                      {field.value
                        ? fieldTypes.find(
                          (fieldType) => fieldType.value === field.value
                        )?.label
                        : "Seleccionar tipo de campo"}
                    </p>
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Command>
                  <CommandInput
                    placeholder="Buscar..."
                    className="h-8"
                  />
                  <CommandList>
                    <CommandEmpty>No se encontraron resultados</CommandEmpty>
                    <CommandGroup>
                      {fieldTypes.map((fieldType) => (
                        <CommandItem
                          value={fieldType.value}
                          key={fieldType.value}
                          onSelect={() => {
                            if (fieldType.value === "imc") {
                              setValue("title", "Índice de masa corporal");
                            }

                            setValue("type.primitive_type", fieldType.value);
                            setValue("type.properties", {});
                          }}
                        >
                          {fieldType.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              fieldType.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel>Nombre del campo</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Título..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="is_required"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-md border px-3 h-9 shadow-sm">
            <FormLabel>¿Es requerido?</FormLabel>
            <FormControl>
              <Switch
                className="!m-0"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      {properties.map((propKey) => (
        <FormField
          key={propKey}
          control={control}
          name={`type.properties.${propKey}`}
          render={({ field }) => {
            const { ref, ...restField } = field;
            return <FormItem className="flex flex-col w-full">
              <FormLabel>{propFieldAdapter[propKey as keyof typeof propFieldAdapter]}</FormLabel>
              <FormControl>
                <PropField
                  propKey={propKey}
                  field={restField}
                  primitiveType={selectedType}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          }}
        />
      ))}
    </div>
  )
}