"use client"

import { FormTabs } from "@/components/form-tabs"
import Header from "@/components/header"
import { Form } from "@/components/ui/form"
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, parseISO } from "date-fns"
import { Save, Sticker } from "lucide-react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import NotesForm from "../../components/notes-form"
import GeneralForm from "../../components/general-form"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import CustomSonner from "@/components/custom-sonner"
import { toast } from "sonner"
import { newPurchaseReceiptSchema } from "../../../schemas/purchase-receipts"
import { defaultValues } from "../../default-values"
import { useGetPurchaseReceiptQuery, useUpdatePurchaseReceiptMutation } from "@/lib/services/purchase-receipts"
import { parseDate } from "@internationalized/date"

const tabs = [
  {
    value: "tab-1",
    label: "Notas",
    icon: <Sticker size={16} />,
    content: <NotesForm />
  }
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const router = useRouter()

  const { data: purchaseReceipt } = useGetPurchaseReceiptQuery(id, {
    skip: !id,
  })

  const [updatePurchaseReceipt, { isLoading: isUpdatingPurchaseReceipt }] = useUpdatePurchaseReceiptMutation()

  const form = useForm<z.infer<typeof newPurchaseReceiptSchema>>({
    resolver: zodResolver(newPurchaseReceiptSchema),
    defaultValues: defaultValues
  })

  console.log(form.formState.errors)

  const onSubmit = async (data: z.infer<typeof newPurchaseReceiptSchema>) => {
    const { purchase_order, ...rest } = data
    try {
      const response = await updatePurchaseReceipt(
        {
          data: {
            ...rest,
            reception_date: rest.reception_date.toString(),
          },
          id: id
        }).unwrap()

      if (response.status === "success") {
        router.push(`/purchases/purchase-receipts/${id}`)
        toast.custom((t) => <CustomSonner t={t} description="Recepción de compra editada exitosamente" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al editar la recepción de compra" variant="error" />)
    }
  }

  useEffect(() => {
    if (!purchaseReceipt) return;
    form.reset({
      ...defaultValues,
      supplier: purchaseReceipt.supplier.id,
      reception_location: purchaseReceipt.reception_location.id,
      reception_date: purchaseReceipt?.reception_date && parseDate(purchaseReceipt?.reception_date.split("T")[0]),
      items: purchaseReceipt.items.map(item => ({
        product_id: item.product_id,
        product_uom: item.product_uom.id,
        expected_quantity: item.expected_quantity,
        quantity: item.quantity,
      })),
    })
  }, [purchaseReceipt])

  return (
    <Form {...form}>
      <Header title="Editar recepción" >
        <div className="flex justify-end gap-2 ml-auto">
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            loading={isUpdatingPurchaseReceipt}
            size="sm"
          >
            <Save className={cn((isUpdatingPurchaseReceipt) && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
    </Form>
  )
}