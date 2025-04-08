"use client";

import DatePicker from "@/components/date-picker";
import FormTable from "@/components/form-table";
import Header from "@/components/header";
import SearchSelect from "@/components/search-select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDeliveryMutation } from "@/lib/services/deliveries";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { newDeliveryNoteSchema } from "../../schemas/delivery-notes";
import { columns } from "./components/columns";
import TableFooter from "./components/table-footer";
import CustomSonner from "@/components/custom-sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useGetInvoiceQuery } from "@/lib/services/invoices";
import { useEffect } from "react";

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

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const invoiceId = searchParams.get("invoiceId")

  const { data: invoice } = useGetInvoiceQuery(invoiceId!, { skip: !invoiceId })
  const [createPurchaseReceipt, { isLoading: isCreatingDeliveryNote }] = useCreateDeliveryMutation()

  const newDeliveryNote = useForm<z.infer<typeof newDeliveryNoteSchema>>({
    resolver: zodResolver(newDeliveryNoteSchema),
    defaultValues: {
      items: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof newDeliveryNoteSchema>) => {
    try {
      const response = await createPurchaseReceipt({
        ...data,
        reception_date: data.reception_date.toString(),
        reception_location: 1, // ! A modo de prueba se está enviando un valor fijo
        source_location: 1, // ! A modo de prueba se está enviando un valor fijo
      }).unwrap()

      if (response.status === "success") {
        router.push(`/purchases/purchase-receipts/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Remito creado exitosamente" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear el remito" variant="error" />)
    }
  }

  useEffect(() => {
    if (invoice) {
      newDeliveryNote.reset({
        customer: invoice.customer.id,
        move_type: "direct",
        items: invoice.items.map((item) => ({
          product_id: item.product_id,
          name: item.product_name, // ! Esto no debería existir
          quantity: item.quantity,
          product_uom: 1,
        }))
      })
    }
  }, [invoice])

  return (
    <Form {...newDeliveryNote}>
      <Header title="Nuevo remito">
        <div className="flex justify-end gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newDeliveryNote.handleSubmit(onSubmit)}
            loading={isCreatingDeliveryNote}
            size="sm"
          >
            <Save className={cn(isCreatingDeliveryNote && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <FormField
          control={newDeliveryNote.control}
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
              {newDeliveryNote.formState.errors.source_location ? (
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
          control={newDeliveryNote.control}
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
              {newDeliveryNote.formState.errors.reception_location ? (
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
          control={newDeliveryNote.control}
          name="reception_date"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Fecha de entrega</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value || null}
                  onChange={(date) => field.onChange(date)}
                />
              </FormControl>
              {newDeliveryNote.formState.errors.reception_date ? (
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
          control={newDeliveryNote.control}
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
                Estas notas serán visibles en el remito.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={newDeliveryNote.control}
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
              {newDeliveryNote.formState.errors.items?.message && (
                <p className="text-destructive text-[12.8px] mt-1 font-medium">
                  {newDeliveryNote.formState.errors.items.message}
                </p>
              )}
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}
