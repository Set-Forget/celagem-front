// itemsColumns.tsx

import * as React from "react";
import { Control, FieldValues, useWatch } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { AsyncSelect } from "@/components/async-select";
import { z } from "zod";
import { MultiSelect } from "@/components/multi-select";
import { Group, NumberField, Input as AriaInput, Label as AriaLabel, Button as AriaButton } from "react-aria-components"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { FormTableColumn } from "@/components/form-table";
import { newInvoiceSchema } from "../../schemas/invoices";

// ! Debe traerse de la API
const materials = [
  {
    id: 1,
    name: "Material 1",
    code: "MAT-001",
    price: 100,
  },
  {
    id: 2,
    name: "Material 2",
    code: "MAT-002",
    price: 200,
  },
  {
    id: 3,
    name: "Material 3",
    code: "MAT-003",
    price: 300,
  },
  {
    id: 4,
    name: "Material 4",
    code: "MAT-004",
    price: 400,
  },
  {
    id: 5,
    name: "Material 5",
    code: "MAT-005",
    price: 500,
  }
]

// ! Debe traerse de la API
const taxes = [
  {
    id: 1,
    name: "21%",
    amount: 21,
  },
  {
    id: 2,
    name: "10.5%",
    amount: 10.5,
  },
  {
    id: 3,
    name: "Exento",
    amount: 0,
  }
]

// ! Debe traerse de la API
const currencies = [
  { label: "ARS (Peso argentino)", value: "ARS", id: 1 },
  { label: "COP (Peso colombiano)", value: "COP", id: 2 },
  { label: "USD (Dólar estadounidense)", value: "USD", id: 3 },
] as const;

const UnitPriceCell = ({ control, index }: { control: Control<z.infer<typeof newInvoiceSchema>>; index: number }) => {
  const productId = useWatch({
    control,
    name: `items.${index}.product_id`,
  });
  const currency = useWatch({
    control,
    name: "currency",
  });

  const unitPrice = materials.find((material) => material.id === productId)?.price;

  return (
    <div className="flex items-center gap-1 justify-end">
      <div className="opacity-50">
        {currencies.find((c) => c.id === Number(currency))?.value}
      </div>
      <span>{unitPrice}</span>
    </div>
  );
};

const SubtotalCell = ({ control, index }: { control: Control<z.infer<typeof newInvoiceSchema>>; index: number }) => {
  const productId = useWatch({
    control,
    name: `items.${index}.product_id`,
  });
  const currency = useWatch({
    control,
    name: "currency",
  });

  const unitPrice = materials.find((material) => material.id === productId)?.price;
  const quantity = useWatch({
    control,
    name: `items.${index}.quantity`,
  });

  const subtotal = (quantity || 0) * Number(unitPrice || 0)

  return (
    <>
      {currencies.find((c) => c.id === Number(currency))?.value}{" "}
      <span>{subtotal.toFixed(2)}</span>
    </>
  );
}

export const columns: FormTableColumn<z.infer<typeof newInvoiceSchema>>[] = [
  {
    header: "Material",
    width: 300,
    cellClassName: "pr-0",
    renderCell: (
      control,
      index,
    ) => {
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
              <AsyncSelect<{ id: number, name: string, code: string, price: number }, number>
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
                      [{item.code}]
                    </span>
                    {item.name}
                  </div>
                )}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <>{item.name} ({item.code})</>}
                onChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => item.code}
                noResultsMessage="No se encontraron resultados"
                modal
              />
            </FormControl>
          </FormItem>
        )}
      />
    }
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
  },
  {
    header: "Precio Unitario",
    width: 150,
    align: "right",
    cellClassName: "pr-4 border-l-0",
    renderCell: (control, index) => (
      <UnitPriceCell control={control} index={index} />
    ),
  },
  {
    header: "Impuestos",
    width: 200,
    cellClassName: "pr-0",
    renderCell: (control, index) => (
      <FormField
        control={control}
        name={`items.${index}.taxes_id`}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormControl>
              <MultiSelect<{ id: number, name: string, amount: number }, number>
                options={taxes}
                getDisplayValue={(option) => option.name}
                getOptionValue={(option) => option.id}
                renderOption={(option) => option.name}
                onValueChange={field.onChange}
                getOptionKey={(option) => String(option.id)}
                placeholder="Impuestos..."
                searchPlaceholder="Buscar impuestos..."
                className="rounded-none shadow-none border-none bg-transparent pl-4"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
  },
  {
    header: "Subtotal (Sin imp.)",
    width: 200,
    align: "left",
    cellClassName: "pl-4",
    renderCell: (control, index) => (
      <SubtotalCell control={control} index={index} />
    ),
  },
];
