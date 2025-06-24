"use client"

import { FormTabs, FormTabsDefinition } from "@/components/form-tabs"
import Header from "@/components/header"
import { Form } from "@/components/ui/form"
import { useLazyGetMaterialQuery } from "@/lib/services/materials"
import { useGetPurchaseRequestQuery } from "@/lib/services/purchase-requests"
import { formatDateToISO } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseDate } from "@internationalized/date"
import { Sticker, Wallet } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newPurchaseOrderFiscalSchema, newPurchaseOrderNotesSchema, newPurchaseOrderSchema } from "../../schemas/purchase-orders"
import FiscalForm from "../components/fiscal-form"
import GeneralForm from "../components/general-form"
import NotesForm from "../components/notes-form"
import Actions from "./actions"
import { defaultValues } from "../default-values"
import { format, parseISO } from "date-fns"

const tabs: FormTabsDefinition["tabs"] = [
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
  const searchParams = useSearchParams()

  const [getMaterial] = useLazyGetMaterialQuery();

  const purchaseRequestId = searchParams.get("purchase_request_id")

  const { data: purchaseRequest } = useGetPurchaseRequestQuery(purchaseRequestId!, { skip: !purchaseRequestId })

  const newPurchaseOrderForm = useForm<z.infer<typeof newPurchaseOrderSchema>>({
    resolver: zodResolver(newPurchaseOrderSchema),
    defaultValues
  })

  useEffect(() => {
    if (!purchaseRequest || !purchaseRequestId) return;
    (async () => {
      const itemsWithPrices = await Promise.all(
        purchaseRequest.items.map(async (item) => {
          const { standard_price } = await getMaterial(item.product_id).unwrap();
          return {
            product_id: item.product_id,
            product_qty: item.quantity,
            price_unit: standard_price || 0,
          };
        })
      );
      newPurchaseOrderForm.reset({
        required_date: parseDate(format(parseISO(purchaseRequest.request_date), "yyyy-MM-dd")),
        purchase_request: purchaseRequest.id,
        items: itemsWithPrices,
      });
    })();
  }, [purchaseRequest, purchaseRequestId]);

  return (
    <Form {...newPurchaseOrderForm}>
      <Header title="Nueva orden de compra">
        <Actions />
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
    </Form>
  )
}