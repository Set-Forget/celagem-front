"use client";

import CustomSonner from "@/components/custom-sonner";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Form
} from "@/components/ui/form";
import { useCreateDeliveryMutation } from "@/lib/services/deliveries";
import { useGetInvoiceQuery } from "@/lib/services/invoices";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Sticker } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newDeliveryNoteSchema } from "../../schemas/delivery-notes";
import NotesForm from "./components/notes-form";
import DataTabs from "@/components/data-tabs";
import GeneralForm from "./components/general-form";
import { format } from "date-fns";

const tabs = [
  {
    value: "tab-1",
    label: "Notas",
    icon: <Sticker className="mr-1.5" size={16} />,
    content: <NotesForm />
  }
]

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const invoiceId = searchParams.get("invoiceId")

  const [tab, setTab] = useState(tabs[0].value)

  const { data: invoice } = useGetInvoiceQuery(invoiceId!, { skip: !invoiceId })
  const [createPurchaseDelivery, { isLoading: isCreatingDeliveryNote }] = useCreateDeliveryMutation()

  const newDeliveryNote = useForm<z.infer<typeof newDeliveryNoteSchema>>({
    resolver: zodResolver(newDeliveryNoteSchema),
    defaultValues: {
      items: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof newDeliveryNoteSchema>) => {
    try {
      const response = await createPurchaseDelivery({
        ...data,
        delivery_date: data.delivery_date.toString(),
        scheduled_date: format(new Date(), "yyyy-MM-dd"),
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
      <GeneralForm />
      <DataTabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        triggerClassName="mt-4"
        // ? data-[state=inactive]:hidden se usa para ocultar el contenido de las tabs que no estén activas, esto es necesario porque forceMount hace que el contenido de todas las tabs se monte al mismo tiempo.
        contentClassName="data-[state=inactive]:hidden"
        // ? forceMount se usa para que el contenido de las tabs no se desmonte al cambiar de tab, esto es necesario para que los errores de validación no se pierdan al cambiar de tab.
        forceMount
      />
    </Form>
  );
}
