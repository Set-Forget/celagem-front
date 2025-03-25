import { Box, CalendarIcon, House } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useForm, useFormContext } from "react-hook-form"
import { z } from "zod"
import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { v4 as uuidv4 } from 'uuid'
//import { chema } from "../schemas/purchase-receipts"
import DataTabs from "@/components/data-tabs"
import { useState } from "react"
import { newPurchaseReceiptSchema } from "../../../schemas/purchase-receipts"
import DatePicker from "@/components/date-picker"
import SearchSelect from "@/components/search-select"
import FormTable from "@/components/form-table"
import TableFooter from "./table-footer"
import { columns } from "./columns"
import { useSearchParams } from "next/navigation"
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders"

const source_locations = [
  { value: "1", label: "Bodega principal" },
  { value: "2", label: "Bodega secundaria" },
  { value: "3", label: "Bodega de insumos" },
  { value: "4", label: "Bodega de productos terminados" },
]

const reception_locations = [
  { value: "1", label: "Bodega principal" },
  { value: "2", label: "Bodega secundaria" },
  { value: "3", label: "Bodega de insumos" },
  { value: "4", label: "Bodega de productos terminados" },
]

export default function GeneralForm() {
  const searchParams = useSearchParams()

  const { control, formState } = useFormContext<z.infer<typeof newPurchaseReceiptSchema>>()

  const purchaseOrderId = searchParams.get("purchase_order_id")

  const { isLoading: isPurchaseOrderLoading } = useGetPurchaseOrderQuery(purchaseOrderId!, { skip: !purchaseOrderId })

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {/*             <FormField
              control={control}
              name="purchase_order"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">
                    Número de orden de compra
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="432000003"
                      {...field}
                    />
                  </FormControl>
                  {formState.errors.purchase_order ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Esta será la orden de compra a la que se asociará la recepción.
                    </FormDescription>
                  }
                </FormItem>
              )}
            /> */}
      <FormField
        control={control}
        name="source_location"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Ubicación de origen
            </FormLabel>
            <FormControl>
              <SearchSelect
                value={field.value}
                onSelect={field.onChange}
                options={source_locations}
                placeholder="Ubicación de origen"
                searchPlaceholder="Buscar..."
              />
            </FormControl>
            {formState.errors.source_location ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la ubicación de origen del pedido.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="reception_location"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Ubicación de recepción
            </FormLabel>
            <FormControl>
              <SearchSelect
                value={field.value}
                onSelect={field.onChange}
                options={reception_locations}
                placeholder="Ubicación de recepción"
                searchPlaceholder="Buscar..."
              />
            </FormControl>
            {formState.errors.reception_location ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la ubicación en la que se recibió el pedido.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="reception_date"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Fecha de recepción</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value || null}
                onChange={(date) => field.onChange(date)}
              />
            </FormControl>
            {formState.errors.reception_date ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la fecha en la que se recibió el pedido.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full md:col-span-2">
            <FormLabel className="w-fit">Notas</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Notas..."
                className="resize-none"
              />
            </FormControl>
            <FormDescription>
              Estas notas serán visibles en la recepción de compra.
            </FormDescription>
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
              <FormTable<z.infer<typeof newPurchaseReceiptSchema>>
                columns={columns}
                footer={({ append }) => <TableFooter append={append} />}
                loading={isPurchaseOrderLoading}
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