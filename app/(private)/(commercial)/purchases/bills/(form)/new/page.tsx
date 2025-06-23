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
import { defaultValues } from "../default-values"
import Actions from "./actions"
import ConfirmPurchaseOrderDialog from "./components/confirm-purchase-order-dialog"
import { useGetPurchaseReceiptQuery } from "@/lib/services/purchase-receipts"
import { useLazyGetMaterialQuery } from "@/lib/services/materials"

const tabs = [
  {
    value: "tab-1",
    label: "Fiscal",
    icon: <Wallet size={16} />,
    content: <FiscalForm />,
    schema: newBillFiscalSchema,
  },
  {
    value: "tab-2",
    label: "Notas",
    icon: <Sticker size={16} />,
    content: <NotesForm />,
    schema: newBillNotesSchema,
  }
]

export default function Page() {
  const searchParams = useSearchParams()

  const purchaseOrderId = searchParams.get("purchase_order_id")
  const purchaseReceiptId = searchParams.get("purchase_receipt_id")

  const { data: purchaseOrder } = useGetPurchaseOrderQuery(purchaseOrderId!, { skip: !purchaseOrderId })
  const { data: purchaseReceipt } = useGetPurchaseReceiptQuery(purchaseReceiptId!, { skip: !purchaseReceiptId })

  const [getSupplier] = useLazyGetSupplierQuery()
  const [getMaterial] = useLazyGetMaterialQuery();

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

  useEffect(() => {
    if (!purchaseReceipt || !purchaseReceiptId) return
    (async () => {
      const supplier = await getSupplier(purchaseReceipt.supplier.id).unwrap()

      const itemsWithPrices = await Promise.all(
        purchaseReceipt.items.map(async (item) => {
          const { standard_price } = await getMaterial(item.product_id).unwrap();
          return {
            product_id: item.product_id,
            quantity: item.quantity,
            price_unit: standard_price || 0,
          };
        })
      );

      newBillForm.reset({
        supplier: purchaseReceipt?.supplier?.id,
        currency: supplier?.currency?.id,
        payment_term: supplier?.property_payment_term?.id,
        payment_method: supplier?.payment_method?.id,
        stock_picking: purchaseReceipt.id,
        items: itemsWithPrices
      })
    })()
  }, [purchaseReceipt, purchaseReceiptId])

  return (
    <Form {...newBillForm}>
      <Header title="Nueva factura de compra">
        <Actions />
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
      <ConfirmPurchaseOrderDialog />
    </Form>
  )
}