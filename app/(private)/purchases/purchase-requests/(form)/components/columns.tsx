// itemsColumns.tsx

import { AsyncSelect } from "@/components/async-select";
import { FormTableColumn } from "@/components/form-table";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button as AriaButton, Input as AriaInput, Label as AriaLabel, Group, NumberField } from "react-aria-components";
import { z } from "zod";
import { newPurchaseRequestSchema } from "../../schemas/purchase-requests";
import { Control } from "react-hook-form";
import { useLazyListMaterialsQuery } from "@/lib/services/materials";
import { materials } from "@/lib/mocks/materials";

const MaterialsCell = ({ control, index }: { control: Control<z.infer<typeof newPurchaseRequestSchema>>; index: number }) => {
  const [searchMaterials] = useLazyListMaterialsQuery()

  /*   const handleSearchMaterial = async (query?: string) => {
      try {
        const response = await searchMaterials({ name: query }).unwrap()
        return response.data?.map(material => ({
          id: material.id,
          name: material.name,
          price: material.sale_price
        }))
      }
      catch (error) {
        console.error(error)
        return []
      }
    } */

  const handleSearchMaterial = async (query?: string) => {
    if (!query) return materials
    return materials.filter((material) => material.name.toLowerCase().includes(query.toLowerCase())) || []
  }

  return <FormField
    control={control}
    name={`items.${index}.product_id`}
    render={({ field }) => (
      <FormItem className="flex flex-col w-full">
        <FormControl>
          <AsyncSelect<{ id: number, name: string, lst_price: number }, number>
            label="Material"
            triggerClassName={cn(
              "!w-full rounded-none border-none shadow-none bg-transparent pl-4",
              control._formState.errors.items?.[index]?.product_id && "outline outline-1 outline-offset-[-1px] outline-destructive"
            )}
            placeholder="Buscar material..."
            fetcher={handleSearchMaterial}
            getDisplayValue={(item) => (
              <div className="flex gap-1">
                {/*                 <span className="font-medium">
                  [{item.code}]
                </span> */}
                {item.name}
              </div>
            )}
            getOptionValue={(item) => item.id}
            renderOption={(item) => <>{item.name} {/* ({item.code}) */}</>}
            onChange={field.onChange}
            value={field.value}
            getOptionKey={(item) => String(item.id)}
            noResultsMessage="No se encontraron resultados"
          />
        </FormControl>
      </FormItem>
    )}
  />
}

export const columns: FormTableColumn<z.infer<typeof newPurchaseRequestSchema>>[] = [
  {
    header: "Material",
    width: 300,
    cellClassName: "pr-0",
    renderCell: (
      control,
      index,
    ) => <MaterialsCell control={control} index={index} />,
  },
  {
    header: "Cantidad",
    width: 100,
    align: "right",
    headerClassName: "px-0 pr-9",
    renderCell: (control, index) => (
      <FormField
        control={control}
        name={`items.${index}.quantity`}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormControl>
              <NumberField
                defaultValue={1}
                minValue={1}
                onChange={field.onChange}
                value={field.value}
              >
                <div className="*:not-first:mt-2">
                  <AriaLabel className="sr-only">Cantidad</AriaLabel>
                  <Group className="rounded-none border-none doutline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden border text-sm whitespace-nowrap transition-[color,box-shadow] data-disabled:opacity-50 justify-between">
                    <AriaInput className="text-end bg-transparent text-foreground w-full px-3 py-2 tabular-nums rounded-none border-none" />
                    <div className="flex h-[calc(100%+2px)] flex-col">
                      <AriaButton
                        slot="increment"
                        className="!border-r-2 border-l px-1 rounded-none bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronUpIcon size={14} aria-hidden="true" />
                      </AriaButton>
                      <AriaButton
                        slot="decrement"
                        className="!border-r-2 border-l px-1 rounded-none bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronDownIcon size={14} aria-hidden="true" />
                      </AriaButton>
                    </div>
                  </Group>
                </div>
              </NumberField>
            </FormControl>
          </FormItem>
        )}
      />
    ),
  }
];
