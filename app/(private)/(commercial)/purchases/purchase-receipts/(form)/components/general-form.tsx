import { FormTableFooter } from "@/app/(private)/(commercial)/components/form-table-footer"
import { useSupplierSelect } from "@/hooks/use-supplier-select"
import { AsyncSelect } from "@/components/async-select"
import DatePicker from "@/components/date-picker"
import FormTable from "@/components/form-table"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders"
import { useLazyListStocksQuery } from "@/lib/services/stocks"
import { useSendMessageMutation } from "@/lib/services/telegram"
import { getLocalTimeZone, today } from "@internationalized/date"
import { useSearchParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"
import { NewPurchaseReceipt, NewPurchaseReceiptLine, newPurchaseReceiptSchema } from "../../schemas/purchase-receipts"
import { getColumns } from "./columns"

export default function GeneralForm() {
  const searchParams = useSearchParams()

  const { control, formState } = useFormContext<z.infer<typeof newPurchaseReceiptSchema>>()

  const purchaseOrderId = searchParams.get("purchase_order_id")

  const { isLoading: isPurchaseOrderLoading } = useGetPurchaseOrderQuery(purchaseOrderId!, { skip: !purchaseOrderId })

  const [sendMessage] = useSendMessageMutation();
  const [searchStocks] = useLazyListStocksQuery()

  const { initialOptions: initialSupplier, fetcher: handleSearchSupplier } = useSupplierSelect({
    supplierId: control._getWatch("supplier"),
  })

  const handleSearchStock = async (query?: string) => {
    try {
      const response = await searchStocks({ name: query }).unwrap()
      return response.data?.map(stock => ({
        id: stock.id,
        name: stock.name,
        company: stock.company,
      }))
        .filter(stock => stock?.id === 14)
        .slice(0, 10)
    }
    catch (error) {
      sendMessage({
        location: "app/(private)/(commercial)/purchases/purchase-receipts/(form)/components/general-form.tsx",
        rawError: error,
        fnLocation: "handleSearchStock"
      }).unwrap().catch((error) => {
        console.error(error);
      });
      return []
    }
  }

  const columns = getColumns(!!purchaseOrderId)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="supplier"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Proveedor</FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string }, number>
                label="Proveedor"
                triggerClassName="!w-full"
                placeholder="Seleccionar proveedor..."
                fetcher={handleSearchSupplier}
                getDisplayValue={(item) => item.name}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.name}</div>}
                onChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => String(item.id)}
                noResultsMessage="No se encontraron resultados"
                initialOptions={initialSupplier}
              />
            </FormControl>
            {formState.errors.supplier ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será el proveedor al que se le asignará la recepción de compra.
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
                isDateUnavailable={(date) => date.compare(today(getLocalTimeZone())) > 0}
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
                name="items"
                className="col-span-2"
                columns={columns}
                loading={isPurchaseOrderLoading}
                footer={({ append }) =>
                  <FormTableFooter<NewPurchaseReceipt, NewPurchaseReceiptLine>
                    control={control}
                    onAddRow={() => append({ id: uuidv4(), product_id: null, quantity: 1 })}
                    colSpan={columns.length}
                    selectors={{
                      items: (values) => values.items,
                    }}
                  />
                }
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