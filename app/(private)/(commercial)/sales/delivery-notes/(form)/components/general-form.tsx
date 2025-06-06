import { FormTableFooter } from "@/app/(private)/(commercial)/components/form-table-footer";
import { useCustomerSelect } from "@/app/(private)/(commercial)/hooks/use-customer-select";
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
import { v4 as uuidv4 } from 'uuid';
import { z } from "zod";
import { NewDeliveryNote, NewDeliveryNoteLine, newDeliveryNoteSchema } from "../../schemas/delivery-notes";
import { columns } from "./columns";
import { useSendMessageMutation } from "@/lib/services/telegram";

export default function GeneralForm() {
  const { control, formState } = useFormContext<z.infer<typeof newDeliveryNoteSchema>>()

  const [sendMessage] = useSendMessageMutation();
  const [searchStocks] = useLazyListStocksQuery()

  const { initialOptions: initialCustomer, fetcher: handleSearchCustomer } = useCustomerSelect({
    customerId: control._getWatch("customer"),
  })

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
      sendMessage({
        location: "app/(private)/(commercial)/sales/delivery-notes/(form)/components/general-form.tsx",
        rawError: error,
        fnLocation: "handleSearchStock"
      }).unwrap().catch((error) => {
        console.error(error);
      });
      return []
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="customer"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Cliente</FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string }, number>
                label="Cliente"
                triggerClassName="!w-full"
                placeholder="Seleccionar cliente..."
                fetcher={handleSearchCustomer}
                getDisplayValue={(item) => item.name}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.name}</div>}
                onChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => String(item.id)}
                noResultsMessage="No se encontraron resultados"
                initialOptions={initialCustomer}
              />
            </FormControl>
            {formState.errors.customer ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será el cliente al que se le asignará el remito.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      {/*       <FormField
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
      /> */}
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
                name="items"
                className="col-span-2"
                footer={({ append }) =>
                  <FormTableFooter<NewDeliveryNote, NewDeliveryNoteLine>
                    control={control}
                    onAddRow={() => append({ id: uuidv4(), product_id: null, product_uom: null, quantity: 1 })}
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