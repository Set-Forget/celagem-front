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

// ! Debe traerse de la API
const materials = [
  {
    "id": 53,
    "name": "Screw",
    "type": "consu",
    "categ_id": [
      9,
      "All / Consumable"
    ],
    "lst_price": 0.2,
    "standard_price": 0.1,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 52,
    "name": "Bolt",
    "type": "consu",
    "categ_id": [
      9,
      "All / Consumable"
    ],
    "lst_price": 0.5,
    "standard_price": 0.5,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 44,
    "name": "Customizable Desk",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 750.0,
    "standard_price": 0.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 45,
    "name": "Customizable Desk",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 750.0,
    "standard_price": 0.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 37,
    "name": "Local Delivery",
    "type": "service",
    "categ_id": [
      5,
      "All / Saleable / Services"
    ],
    "lst_price": 10.0,
    "standard_price": 0.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 16,
    "name": "Corner Desk Right Sit",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 147.0,
    "standard_price": 600.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 17,
    "name": "Large Cabinet",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 320.0,
    "standard_price": 800.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 18,
    "name": "Storage Box",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 15.8,
    "standard_price": 14.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 19,
    "name": "Large Desk",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 1799.0,
    "standard_price": 1299.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 20,
    "name": "Pedal Bin",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 47.0,
    "standard_price": 10.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 21,
    "name": "Cabinet with Doors",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 140.0,
    "standard_price": 120.5,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 23,
    "name": "Conference Chair",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 33.0,
    "standard_price": 0.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 24,
    "name": "Conference Chair",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 39.4,
    "standard_price": 0.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 40,
    "name": "Desk Organizer",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 5.1,
    "standard_price": 0.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 41,
    "name": "Desk Pad",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 1.98,
    "standard_price": 0.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 42,
    "name": "Monitor Stand",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 3.19,
    "standard_price": 0.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 12,
    "name": "Customizable Desk",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 750.0,
    "standard_price": 500.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 13,
    "name": "Customizable Desk",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 750.0,
    "standard_price": 500.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 14,
    "name": "Customizable Desk",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 800.4,
    "standard_price": 500.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 25,
    "name": "Office Chair Black",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 120.5,
    "standard_price": 180.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 30,
    "name": "Individual Workplace",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 885.0,
    "standard_price": 876.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 26,
    "name": "Corner Desk Left Sit",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 85.0,
    "standard_price": 78.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 60,
    "name": "Drawer Black",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 24.0,
    "standard_price": 20.0,
    "tracking": "lot",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 51,
    "name": "Table Leg",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 50.0,
    "standard_price": 10.0,
    "tracking": "lot",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 48,
    "name": "Cable Management Box",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 100.0,
    "standard_price": 70.0,
    "tracking": "lot",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 61,
    "name": "Drawer Case Black",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 20.0,
    "standard_price": 10.0,
    "tracking": "lot",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 31,
    "name": "Acoustic Bloc Screens",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 295.0,
    "standard_price": 0.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 32,
    "name": "Acoustic Bloc Screens",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 295.0,
    "standard_price": 0.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 35,
    "name": "Large Meeting Table",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 4000.0,
    "standard_price": 4500.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 57,
    "name": "Wood Panel",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 100.0,
    "standard_price": 80.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 54,
    "name": "Ply Layer",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 10.0,
    "standard_price": 10.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 5,
    "name": "Office Chair",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 70.0,
    "standard_price": 55.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 8,
    "name": "Desk Combination",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 450.0,
    "standard_price": 300.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 59,
    "name": "Table Kit",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 147.0,
    "standard_price": 600.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 29,
    "name": "Desk Stand with Screen",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 2100.0,
    "standard_price": 2010.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 55,
    "name": "Wear Layer",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 10.0,
    "standard_price": 10.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 34,
    "name": "Four Person Desk",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 2350.0,
    "standard_price": 2500.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 50,
    "name": "Table Top",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 380.0,
    "standard_price": 240.0,
    "tracking": "serial",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 58,
    "name": "Plastic Laminate",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 1000.0,
    "standard_price": 3000.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 33,
    "name": "Drawer",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 110.5,
    "standard_price": 100.0,
    "tracking": "lot",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 6,
    "name": "Office Lamp",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 40.0,
    "standard_price": 35.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 27,
    "name": "Drawer Black",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 25.0,
    "standard_price": 20.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 36,
    "name": "Three-Seat Sofa",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 1500.0,
    "standard_price": 1000.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 28,
    "name": "Flipover",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 1950.0,
    "standard_price": 1700.0,
    "tracking": "lot",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 56,
    "name": "Ply Veneer",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 10.0,
    "standard_price": 10.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 49,
    "name": "Table",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 520.0,
    "standard_price": 290.0,
    "tracking": "serial",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 7,
    "name": "Office Design Software",
    "type": "consu",
    "categ_id": [
      7,
      "All / Saleable / Software"
    ],
    "lst_price": 280.0,
    "standard_price": 235.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 47,
    "name": "Chair floor protection",
    "type": "consu",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 12.0,
    "standard_price": 0.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 46,
    "name": "Deposit",
    "type": "service",
    "categ_id": [
      5,
      "All / Saleable / Services"
    ],
    "lst_price": 150.0,
    "standard_price": 100.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 38,
    "name": "Furniture Assembly",
    "type": "service",
    "categ_id": [
      10,
      "All / Home Construction"
    ],
    "lst_price": 2000.0,
    "standard_price": 2500.0,
    "tracking": "none",
    "uom_id": [
      4,
      "Hours"
    ],
    "cost_method": "standard"
  },
  {
    "id": 2,
    "name": "Hotel Accommodation",
    "type": "service",
    "categ_id": [
      3,
      "All / Expenses"
    ],
    "lst_price": 400.0,
    "standard_price": 400.0,
    "tracking": "none",
    "uom_id": [
      3,
      "Days"
    ],
    "cost_method": "standard"
  },
  {
    "id": 43,
    "name": "Office Combo",
    "type": "combo",
    "categ_id": [
      8,
      "All / Saleable / Office Furniture"
    ],
    "lst_price": 160.0,
    "standard_price": 0.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 39,
    "name": "Outdoor dining table",
    "type": "consu",
    "categ_id": [
      11,
      "All / Saleable / Outdoor furniture"
    ],
    "lst_price": 589.0,
    "standard_price": 0.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 1,
    "name": "Restaurant Expenses",
    "type": "service",
    "categ_id": [
      3,
      "All / Expenses"
    ],
    "lst_price": 14.0,
    "standard_price": 8.0,
    "tracking": "none",
    "uom_id": [
      1,
      "Units"
    ],
    "cost_method": "standard"
  },
  {
    "id": 4,
    "name": "Virtual Home Staging",
    "type": "service",
    "categ_id": [
      5,
      "All / Saleable / Services"
    ],
    "lst_price": 38.25,
    "standard_price": 25.5,
    "tracking": "none",
    "uom_id": [
      4,
      "Hours"
    ],
    "cost_method": "standard"
  },
  {
    "id": 3,
    "name": "Virtual Interior Design",
    "type": "service",
    "categ_id": [
      5,
      "All / Saleable / Services"
    ],
    "lst_price": 30.75,
    "standard_price": 20.5,
    "tracking": "none",
    "uom_id": [
      4,
      "Hours"
    ],
    "cost_method": "standard"
  }
]

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
