import { AsyncSelect } from "@/components/async-select"
import DatePicker from "@/components/date-picker"
import FormTable from "@/components/form-table"
import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders"
import { useLazyListStocksQuery } from "@/lib/services/stocks"
import { cn, placeholder } from "@/lib/utils"
import { Eye } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newPurchaseReceiptSchema } from "../../../schemas/purchase-receipts"
import { columns } from "./columns"
import TableFooter from "./table-footer"

export default function GeneralForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { control, formState } = useFormContext<z.infer<typeof newPurchaseReceiptSchema>>()

  const purchaseOrderId = searchParams.get("purchase_order_id")

  const { data: purchaseOrder, isLoading: isPurchaseOrderLoading } = useGetPurchaseOrderQuery(purchaseOrderId!, { skip: !purchaseOrderId })

  const [searchStocks] = useLazyListStocksQuery()

  const handleSearchStock = async (query?: string) => {
    try {
      const response = await searchStocks({ name: query }).unwrap()
      return response.data?.map(stock => ({
        id: stock.id,
        name: stock.name
      }))
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Orden de compra</label>
          <div className="flex gap-2 items-center group w-fit">
            <span className={cn("text-sm font-medium tracking-tight transition-all duration-300", isPurchaseOrderLoading ? "blur-[4px]" : "blur-none")}>
              {isPurchaseOrderLoading ? placeholder(20, true) : purchaseOrder?.number}
            </span>
            <Button
              variant="outline"
              size="icon"
              className={cn("w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity", isPurchaseOrderLoading && "hidden")}
              onClick={() => router.push(`/purchases/purchase-orders/${purchaseOrder?.id}`)}
            >
              <Eye />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Proveedor</label>
          <div className="flex gap-2 items-center group w-fit">
            <span className={cn("text-sm font-medium tracking-tight transition-all duration-300", isPurchaseOrderLoading ? "blur-[4px]" : "blur-none")}>
              {isPurchaseOrderLoading ? placeholder(20, true) : purchaseOrder?.supplier.name}
            </span>
            <Button
              variant="outline"
              size="icon"
              className={cn("w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity", isPurchaseOrderLoading && "hidden")}
              onClick={() => router.push(`/purchases/vendors/${purchaseOrder?.supplier.id}`)}
            >
              <Eye />
            </Button>
          </div>
        </div>
      </div>
      <Separator className="col-span-full" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <FormField
          control={control}
          name="source_location"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Ubicación de origen</FormLabel>
              <FormControl>
                <AsyncSelect<{ id: number, name: string }, number>
                  label="Ubicación de origen"
                  triggerClassName="!w-full"
                  placeholder="Seleccionar ubicación de origen"
                  fetcher={handleSearchStock}
                  getDisplayValue={(item) => item.name}
                  getOptionValue={(item) => item.id}
                  renderOption={(item) => <div>{item.name}</div>}
                  onChange={field.onChange}
                  value={field.value}
                  getOptionKey={(item) => String(item.id)}
                  noResultsMessage="No se encontraron resultados"
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
              <FormLabel className="w-fit">Ubicación de recepción</FormLabel>
              <FormControl>
                <AsyncSelect<{ id: number, name: string }, number>
                  label="Ubicación de recepción"
                  triggerClassName="!w-full"
                  placeholder="Seleccionar ubicación de recepción"
                  fetcher={handleSearchStock}
                  getDisplayValue={(item) => item.name}
                  getOptionValue={(item) => item.id}
                  renderOption={(item) => <div>{item.name}</div>}
                  onChange={field.onChange}
                  value={field.value}
                  getOptionKey={(item) => String(item.id)}
                  noResultsMessage="No se encontraron resultados"
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
    </>
  )
}