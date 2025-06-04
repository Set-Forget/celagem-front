"use client"

import { FormTabs } from "@/components/form-tabs"
import Header from "@/components/header"
import { Form } from "@/components/ui/form"
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, parseISO } from "date-fns"
import { Sticker } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newPurchaseReceiptSchema } from "../../schemas/purchase-receipts"
import GeneralForm from "../components/general-form"
import NotesForm from "../components/notes-form"
import Actions from "./actions"
import { defaultValues } from "../default-values"

const tabs = [
  {
    value: "tab-1",
    label: "Notas",
    icon: <Sticker size={16} />,
    content: <NotesForm />
  }
]

export default function Page() {
  const searchParams = useSearchParams()

  const purchaseOrderId = searchParams.get("purchase_order_id")

  const { data: purchaseOrder } = useGetPurchaseOrderQuery(purchaseOrderId!, { skip: !purchaseOrderId })

  const newPurchaseReceipt = useForm<z.infer<typeof newPurchaseReceiptSchema>>({
    resolver: zodResolver(newPurchaseReceiptSchema),
    defaultValues
  })

  useEffect(() => {
    if (!purchaseOrder || !purchaseOrderId) return;
    newPurchaseReceipt.reset({
      supplier: purchaseOrder.supplier.id,
      purchase_order: purchaseOrder.id,
      scheduled_date: format(parseISO(purchaseOrder.required_date), "yyyy-MM-dd"),
      move_type: "direct",
      items: purchaseOrder.items.map((item) => ({
        product_id: item.product_id,
        name: item.product_name, // ! No debería ser necesario.
        quantity: item.product_qty - item.qty_received,
        product_uom: item.product_uom.id,
      })).filter(item => item.quantity > 0),
    })
  }, [purchaseOrder, purchaseOrderId])

  return (
    <Form {...newPurchaseReceipt}>
      <Header title="Nueva recepción" >
        <Actions />
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
    </Form>
  )
}