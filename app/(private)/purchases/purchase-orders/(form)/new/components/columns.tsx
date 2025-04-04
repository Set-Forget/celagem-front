import { AsyncMultiSelect } from "@/components/async-multi-select";
import { AsyncSelect } from "@/components/async-select";
import { FormTableColumn } from "@/components/form-table";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { materials } from "@/lib/mocks/materials";
import { useListCurrenciesQuery } from "@/lib/services/currencies";
import { useLazyListTaxesQuery } from "@/lib/services/taxes";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button as AriaButton, Input as AriaInput, Label as AriaLabel, Group, NumberField } from "react-aria-components";
import { Control, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import { newPurchaseOrderSchema } from "../../../schemas/purchase-orders";

const MaterialsCell = ({ control, index }: { control: Control<z.infer<typeof newPurchaseOrderSchema>>; index: number }) => {
  const { setValue } = useFormContext<z.infer<typeof newPurchaseOrderSchema>>()

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
                <span className="font-medium">
                  [{item.id}]
                </span>
                {item.name}
              </div>
            )}
            getOptionValue={(item) => item.id}
            renderOption={(item) => <>{item.name}</>}
            onChange={(value) => {
              field.onChange(value);
              const material = materials.find((material) => material.id === value);
              setValue(`items.${index}.unit_price`, material?.lst_price || 0, { shouldValidate: true });
            }}
            value={field.value}
            getOptionKey={(item) => String(item.id)}
            noResultsMessage="No se encontraron resultados"
            modal
          />
        </FormControl>
      </FormItem>
    )}
  />
}

const TaxesCell = ({ control, index }: { control: Control<z.infer<typeof newPurchaseOrderSchema>>; index: number }) => {
  const { setValue } = useFormContext<z.infer<typeof newPurchaseOrderSchema>>()

  const [searchTaxes] = useLazyListTaxesQuery()

  const handleSearchTax = async (query?: string) => {
    try {
      const response = await searchTaxes({ name: query }).unwrap()
      return response.data?.map(taxes => ({
        id: taxes.id,
        name: taxes.name
      }))
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  return <FormField
    control={control}
    name={`items.${index}.taxes_id`}
    render={({ field }) => (
      <FormItem className="flex flex-col w-full">
        <FormControl>
          <AsyncMultiSelect<{ id: number, name: string }, number>
            className={cn(
              "!w-full rounded-none border-none shadow-none bg-transparent pl-4",
              control._formState.errors.items?.[index]?.taxes_id && "outline outline-1 outline-offset-[-1px] outline-destructive"
            )}
            placeholder="Buscar impuesto..."
            fetcher={handleSearchTax}
            getDisplayValue={(item) => (
              <div className="flex gap-1">
                {item.name}
              </div>
            )}
            getOptionValue={(item) => item.id}
            renderOption={(item) => <>{item.name}</>}
            onValueChange={(value) => {
              field.onChange(value);
              setValue(`items.${index}.taxes_id`, value, { shouldValidate: true });
            }}
            value={field.value}
            getOptionKey={(item) => String(item.id)}
            noResultsMessage="No se encontraron resultados"
          />
        </FormControl>
      </FormItem>
    )}
  />
}

const UnitPriceCell = ({ control, index }: { control: Control<z.infer<typeof newPurchaseOrderSchema>>; index: number }) => {
  const { data: currencies } = useListCurrenciesQuery()

  const currency = useWatch({
    control,
    name: "currency",
  });

  return <FormField
    control={control}
    name={`items.${index}.unit_price`}
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormControl>
          <NumberField
            defaultValue={1}
            minValue={1}
            onChange={field.onChange}
            value={field.value}
            formatOptions={
              currency
                ? {
                  style: "currency",
                  currency: currencies?.data?.find((c) => c.id === currency)?.name,
                  currencyDisplay: "code",
                }
                : undefined
            }
          >
            <div className="*:not-first:mt-2">
              <AriaLabel className="sr-only">Precio unitario</AriaLabel>
              <Group className="rounded-none border-none outline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden border text-sm whitespace-nowrap transition-[color,box-shadow] data-disabled:opacity-50 justify-between">
                <AriaInput className="text-end bg-transparent text-foreground w-full px-3 py-2 tabular-nums rounded-none border-none focus-visible:outline focus-visible:outline-ring focus-visible:!outline-offset-[-1px]" />
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
};

const SubtotalCell = ({ control, index }: { control: Control<z.infer<typeof newPurchaseOrderSchema>>; index: number }) => {
  const { data: currencies } = useListCurrenciesQuery()

  const currency = useWatch({
    control,
    name: "currency",
  });

  const unitPrice = useWatch({
    control,
    name: `items.${index}.unit_price`,
  });

  const quantity = useWatch({
    control,
    name: `items.${index}.product_qty`,
  });

  const subtotal = (quantity || 0) * Number(unitPrice || 0)

  return (
    <>
      {currencies?.data.find((c) => c.id === currency)?.name}{" "}
      <span>{subtotal.toFixed(2)}</span>
    </>
  );
}

const QuantityCell = ({ control, index }: { control: Control<z.infer<typeof newPurchaseOrderSchema>>; index: number }) => {
  return <FormField
    control={control}
    name={`items.${index}.product_qty`}
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
              <Group className="rounded-none border-none outline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden border text-sm whitespace-nowrap transition-[color,box-shadow] data-disabled:opacity-50 justify-between">
                <AriaInput className="text-end bg-transparent text-foreground w-full px-3 py-2 tabular-nums rounded-none border-none focus-visible:outline focus-visible:outline-ring focus-visible:!outline-offset-[-1px]" />
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
}

export const columns: FormTableColumn<z.infer<typeof newPurchaseOrderSchema>>[] = [
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
    renderCell: (control, index) => <QuantityCell control={control} index={index} />,
  },
  {
    header: "Precio unitario",
    width: 150,
    align: "right",
    cellClassName: "border-l-0",
    renderCell: (control, index) => <UnitPriceCell control={control} index={index} />,
  },
  {
    header: "Impuestos",
    width: 200,
    cellClassName: "pr-0 border-l-0",
    renderCell: (control, index) => <TaxesCell control={control} index={index} />,
  },
  {
    header: "Subtotal (Sin imp.)",
    width: 200,
    align: "left",
    cellClassName: "pl-4",
    renderCell: (control, index) => <SubtotalCell control={control} index={index} />
  },
];
