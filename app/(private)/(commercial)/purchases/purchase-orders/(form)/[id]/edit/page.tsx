"use client"

import CustomSonner from "@/components/custom-sonner"
import { FormTabs } from "@/components/form-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useGetPurchaseOrderQuery, useUpdatePurchaseOrderMutation } from "@/lib/services/purchase-orders"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseDate } from "@internationalized/date"
import { Save, Sticker, Wallet } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"
import { newPurchaseOrderFiscalSchema, newPurchaseOrderNotesSchema, newPurchaseOrderSchema } from "../../../schemas/purchase-orders"
import FiscalForm from "../../components/fiscal-form"
import GeneralForm from "../../components/general-form"
import NotesForm from "../../components/notes-form"
import { useSendMessageMutation } from "@/lib/services/telegram"

const tabs = [
  {
    value: "tab-1",
    label: "Fiscal",
    icon: <Wallet size={16} />,
    content: <FiscalForm />,
    schema: newPurchaseOrderFiscalSchema,
  },
  {
    value: "tab-2",
    label: "Notas",
    icon: <Sticker size={16} />,
    content: <NotesForm />,
    schema: newPurchaseOrderNotesSchema,
  },
];

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const router = useRouter()

  const { data: purchaseOrder, isLoading: isLoadingPurchaseOrder } = useGetPurchaseOrderQuery(id!, { skip: !id })

  const [sendMessage] = useSendMessageMutation();
  const [updatePurchaseOrder, { isLoading: isUpdatingPurchaseOrder }] = useUpdatePurchaseOrderMutation()

  const form = useForm<z.infer<typeof newPurchaseOrderSchema>>({
    resolver: zodResolver(newPurchaseOrderSchema),
    defaultValues: {
      items: [],
    }
  })

  const onSubmit = async (data: z.infer<typeof newPurchaseOrderSchema>) => {
    try {
      const response = await updatePurchaseOrder({
        body: {
          ...data,
          required_date: data.required_date.toString(),
          company: 1,
        },
        id: id!
      }).unwrap()

      if (response.status === "success") {
        router.push(`/purchases/purchase-orders/${id}`)
        toast.custom((t) => <CustomSonner t={t} description="Orden de compra actualizada exitosamente" />)
      }
    } catch (error) {
      sendMessage({
        location: "app/(private)/(commercial)/purchases/purchase-orders/(form)/[id]/edit/page.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      }).unwrap().catch((error) => {
        console.error(error);
      });
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar la orden de compra" variant="error" />)
    }
  }

  useEffect(() => {
    if (purchaseOrder) {
      form.reset({
        supplier: purchaseOrder?.supplier?.id,
        currency: purchaseOrder?.currency?.id,
        payment_term: purchaseOrder?.payment_term?.id,
        required_date: purchaseOrder?.required_date && parseDate(purchaseOrder?.required_date?.slice(0, 10)),
        internal_notes: purchaseOrder?.internal_notes || "",
        company: String(purchaseOrder?.company?.id),
        tyc_notes: purchaseOrder?.tyc_notes || "",
        items: purchaseOrder?.items?.map((item) => ({
          id: uuidv4(),
          product_id: item.product_id,
          product_qty: item.product_qty,
          price_unit: item.price_unit,
          taxes_id: item.taxes.map((tax) => tax.id),
        })) || [],
      })
    }
  }, [purchaseOrder]);

  return (
    <Form {...form}>
      <Header title={`Editar orden de compra ${purchaseOrder?.sequence_id}`}>
        <div className="flex justify-end gap-2 ml-auto">
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            size="sm"
            loading={isUpdatingPurchaseOrder}
          >
            <Save className={cn(isUpdatingPurchaseOrder && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
    </Form>
  )
}