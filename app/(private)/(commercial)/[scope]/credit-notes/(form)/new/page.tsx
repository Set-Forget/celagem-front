"use client"

import { FormTabs } from "@/components/form-tabs"
import Header from "@/components/header"
import { Form } from "@/components/ui/form"
import { useGetBillQuery } from "@/lib/services/bills"
import { useGetInvoiceQuery } from "@/lib/services/invoices"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseDate } from "@internationalized/date"
import { format } from "date-fns"
import { Sticker } from "lucide-react"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newCreditNoteSchema } from "../../schemas/credit-notes"
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
  const { scope } = useParams<{ scope: "sales" | "purchases" }>()

  const params = useSearchParams()

  const invoiceId = params.get("invoiceId");
  const billId = params.get("billId");

  const { data: invoice } = useGetInvoiceQuery(invoiceId ?? "", {
    skip: !invoiceId
  });
  const { data: bill } = useGetBillQuery(billId ?? "", {
    skip: !billId
  });

  const document = invoice || bill

  const form = useForm<z.infer<typeof newCreditNoteSchema>>({
    resolver: zodResolver(newCreditNoteSchema),
    defaultValues: {
      ...defaultValues,
      custom_sequence_number: scope === "purchases" ? "" : undefined,
      move_type: scope === "purchases" ? "in_refund" : "out_refund"
    }
  })

  useEffect(() => {
    if (!document || (!invoiceId && !billId)) return;
    const moveType = scope === "purchases" ? "in_refund" : "out_refund"
    form.reset({
      partner: scope === "purchases" ? bill?.supplier.id : invoice?.customer.id,
      currency: document.currency.id,
      move_type: moveType,
      associated_invoice: document.id,
      date: scope === "sales" ? parseDate(format(new Date(), "yyyy-MM-dd")) : undefined,
      items: document.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        taxes_id: item.taxes.map((tax) => tax.id),
        price_unit: item.price_unit,
        cost_center: item.cost_center?.id,
        account_id: item.account?.id,
      })),
    })
  }, [document, invoiceId, billId])

  return (
    <Form {...form}>
      <Header title="Nueva nota de crédito">
        <Actions />
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
    </Form>
  )
}