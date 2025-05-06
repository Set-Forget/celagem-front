"use client"


import { Button } from "@/components/ui/button"

import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import Header from "@/components/header"
import { newPurchaseOrderSchema } from "../../schemas/purchase-orders"

import CustomSonner from "@/components/custom-sonner"
import { materials } from "@/lib/mocks/materials"
import { useCreatePurchaseOrderMutation } from "@/lib/services/purchase-orders"
import { useGetPurchaseRequestQuery } from "@/lib/services/purchase-requests"
import { cn, formatDateToISO } from "@/lib/utils"
import { parseDate } from "@internationalized/date"
import { Save } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import GeneralForm from "../components/general-form"

export default function NewPurchaseOrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [createPurchaseOrder, { isLoading: isCreatingPurchaseOrder }] = useCreatePurchaseOrderMutation()

  const purchaseRequestId = searchParams.get("purchase_request_id")

  const { data: purchaseRequest, isLoading: isPurchaseRequestLoading } = useGetPurchaseRequestQuery(purchaseRequestId!, { skip: !purchaseRequestId })

  const newPurchaseOrderForm = useForm<z.infer<typeof newPurchaseOrderSchema>>({
    resolver: zodResolver(newPurchaseOrderSchema),
    defaultValues: {
      items: [],
    }
  })

  const onSubmit = async (data: z.infer<typeof newPurchaseOrderSchema>) => {
    try {
      const response = await createPurchaseOrder({
        ...data,
        required_date: data.required_date.toString(),
      }).unwrap()

      if (response.status === "success") {
        router.push(`/purchases/purchase-orders/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Orden de compra creada exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la orden de compra" variant="error" />)
    }
  }

  useEffect(() => {
    if (purchaseRequest) {
      newPurchaseOrderForm.reset({
        required_date: parseDate(formatDateToISO(purchaseRequest.request_date)),
        purchase_request: purchaseRequest.id,
        items: purchaseRequest.items.map((item) => ({
          product_id: item.product_id,
          product_qty: item.quantity,
          unit_price: materials.find((material) => material.id === item.product_id)?.lst_price || 0
        }))
      })
    }
  }, [purchaseRequest])

  return (
    <Form {...newPurchaseOrderForm}>
      <Header title="Nueva orden de compra">
        <div className="flex justify-end gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newPurchaseOrderForm.handleSubmit(onSubmit)}
            size="sm"
            loading={isCreatingPurchaseOrder}
          >
            <Save className={cn(isCreatingPurchaseOrder && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <GeneralForm />
    </Form>
  )
}