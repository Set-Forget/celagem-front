import { AsyncSelect } from "@/components/async-select";
import DatePicker from "@/components/date-picker";
import FormTable from "@/components/form-table";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useLazyListStocksQuery } from "@/lib/services/stocks";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { newDeliveryNoteSchema } from "../../../schemas/delivery-notes";
import { columns } from "./columns";
import TableFooter from "./table-footer";

export default function GeneralForm() {
  const { control, formState } = useFormContext<z.infer<typeof newDeliveryNoteSchema>>()

  const [searchStocks] = useLazyListStocksQuery()

  const handleSearchStock = async (query?: string) => {
    try {
      const response = await searchStocks({ name: query }).unwrap()
      return response.data?.map(stock => ({
        id: stock.id,
        name: stock.name
      }))
        .slice(0, 10)
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  return (
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
        name="delivery_location"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Ubicación de entrega</FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string }, number>
                label="Ubicación de entrega"
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
            {formState.errors.delivery_location ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la ubicación en la que se entregó el pedido.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="delivery_date"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Fecha de entrega</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value || null}
                onChange={(date) => field.onChange(date)}
              />
            </FormControl>
            {formState.errors.delivery_date ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la fecha en la que se entregó el pedido.
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
              <FormTable<z.infer<typeof newDeliveryNoteSchema>>
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