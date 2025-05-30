"use client"

import { FormTabs } from "@/components/form-tabs"
import Header from "@/components/header"
import { Form } from "@/components/ui/form"
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders"
import { useLazyGetSupplierQuery } from "@/lib/services/suppliers"
import { zodResolver } from "@hookform/resolvers/zod"
import { Sticker, Wallet } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newBillFiscalSchema, newBillNotesSchema, newBillSchema } from "../../schemas/bills"
import FiscalForm from "../components/fiscal-form"
import GeneralForm from "../components/general-form"
import NotesForm from "../components/notes-form"
import Actions from "./actions"
import { defaultValues } from "../default-values"

const tabs = [
  {
    value: "tab-1",
    label: "Fiscal",
    icon: <Wallet className="mr-1.5" size={16} />,
    content: <FiscalForm />,
    schema: newBillFiscalSchema,
  },
  {
    value: "tab-2",
    label: "Notas",
    icon: <Sticker className="mr-1.5" size={16} />,
    content: <NotesForm />,
    schema: newBillNotesSchema,
  }
]

export default function Page() {
  const searchParams = useSearchParams()

  const purchaseOrderId = searchParams.get("purchase_order_id")

  const { data: purchaseOrder } = useGetPurchaseOrderQuery(purchaseOrderId!, { skip: !purchaseOrderId })

  const [getSupplier] = useLazyGetSupplierQuery()

  const newBillForm = useForm<z.infer<typeof newBillSchema>>({
    resolver: zodResolver(newBillSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!purchaseOrder || !purchaseOrderId) return
    (async () => {
      const supplier = await getSupplier(purchaseOrder.supplier.id).unwrap()
      newBillForm.reset({
        supplier: purchaseOrder.supplier.id,
        currency: purchaseOrder.currency.id,
        payment_term: purchaseOrder?.payment_term?.id,
        payment_method: supplier?.payment_method?.id,
        items: purchaseOrder.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.product_qty,
          taxes_id: item.taxes.map((tax) => tax.id),
          price_unit: item.price_unit
        }))
      })
    })()
  }, [purchaseOrder, purchaseOrderId])

  return (
    <Form {...newBillForm}>
      <Header title="Nueva factura de compra">
        <Actions />
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
    </Form>
  )
}