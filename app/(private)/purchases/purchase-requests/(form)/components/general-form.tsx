import FormTable from "@/components/form-table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { newPurchaseRequestSchema } from "../../schemas/purchase-requests";
import { columns } from "./columns";
import TableFooter from "./table-footer";
import DatePicker from "@/components/date-picker";

export default function GeneralForm() {
  const { control, formState } = useFormContext<z.infer<typeof newPurchaseRequestSchema>>()

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Titulo</FormLabel>
            <FormControl>
              <Input
                placeholder="Compra de materiales..."
                {...field}
              />
            </FormControl>
            {formState.errors.name ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el título de la solicitud de compra.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="request_date"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Fecha de requerimiento</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value || null}
                onChange={(date) => field.onChange(date)}
              />
            </FormControl>
            {formState.errors.request_date ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la fecha en la que se requiere la compra.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      {/* <FormField
                  control={control}
                  name="headquarter"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Sede</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between pl-3 font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? headquarters.find(
                                  (cost_center) => cost_center.id === field.value?.id
                                )?.name
                                : "Selecciona una sede"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Buscar sedes..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                No se encontraron sedes.
                              </CommandEmpty>
                              <CommandGroup>
                                {headquarters.map((cost_center) => (
                                  <CommandItem
                                    value={cost_center.id}
                                    key={cost_center.id}
                                    onSelect={() => {
                                      setValue("headquarter", cost_center)
                                    }}
                                  >
                                    {cost_center.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto",
                                        cost_center.id === field.value?.id
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
                      {formState.errors.headquarter ? (
                        <FormMessage/>
                      ) :
                        <FormDescription>
                          Sede a la que se le asignará la solicitud de compra.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />  */}
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full col-span-2">
            <FormLabel className="w-fit">Notas</FormLabel>
            <FormControl>
              <Textarea
                className="resize-none"
                placeholder="Notas"
                {...field}
              />
            </FormControl>
            {formState.errors.notes ? (
              <FormMessage />
            ) :
              <FormDescription>
                Estas notas serán visibles en la solicitud de compra.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="items"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full col-span-2">
            <FormLabel className="w-fit">Items</FormLabel>
            <FormControl>
              <FormTable<z.infer<typeof newPurchaseRequestSchema>>
                columns={columns}
                footer={({ append }) => <TableFooter append={append} />}
                name="items"
                className="col-span-2"
              />
            </FormControl>
            {formState.errors.items?.message && (
              <p className="text-destructive text-[12.8px] mt-1 font-medium">
                {formState.errors.items.message}
              </p>
            )}
          </FormItem>
        )}
      />
    </div>
  )
}