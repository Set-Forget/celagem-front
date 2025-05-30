"use client"

import { FormTabs } from "@/components/form-tabs"
import Header from "@/components/header"
import { Form } from "@/components/ui/form"
import { useGetBillQuery } from "@/lib/services/bills"
import { useGetInvoiceQuery } from "@/lib/services/invoices"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseDate } from "@internationalized/date"
import { format } from "date-fns"
import { Sticker, Wallet } from "lucide-react"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newDebitNoteFiscalSchema, newDebitNoteNotesSchema, newDebitNoteSchema } from "../../schemas/debit-notes"
import FiscalForm from "../components/fiscal-form"
import GeneralForm from "../components/general-form"
import NotesForm from "../components/notes-form"
import { defaultValues } from "../default-values"
import Actions from "./actions"

const tabs = [
  {
    value: "tab-1",
    label: "Fiscal",
    icon: <Wallet className="mr-1.5" size={16} />,
    content: <FiscalForm />,
    schema: newDebitNoteFiscalSchema
  },
  {
    value: "tab-2",
    label: "Notas",
    icon: <Sticker className="mr-1.5" size={16} />,
    content: <NotesForm />,
    schema: newDebitNoteNotesSchema
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

  const newDebitNoteForm = useForm<z.infer<typeof newDebitNoteSchema>>({
    resolver: zodResolver(newDebitNoteSchema),
    defaultValues: {
      ...defaultValues,
      number: scope === "purchases" ? "" : undefined,
      move_type: scope === "purchases" ? "in_invoice" : "out_invoice"
    }
  })

  useEffect(() => {
    if (!document || (!invoiceId && !billId)) return;
    const moveType = scope === "purchases" ? "in_invoice" : "out_invoice"
    newDebitNoteForm.reset({
      partner: scope === "purchases" ? bill?.supplier.id : invoice?.customer.id,
      currency: document.currency.id,
      move_type: moveType,
      associated_invoice: document.id,
      payment_term: document.payment_term?.id,
      payment_method: document.payment_method?.id,
      tyc_notes: typeof document.tyc_notes === "string" ? document.tyc_notes : "",
      date: scope === "sales" ? parseDate(format(new Date(), "yyyy-MM-dd")) : undefined,
      items: newDebitNoteForm.getValues("items")
    })
  }, [document, invoiceId, billId])

  return (
    <Form {...newDebitNoteForm}>
      <Header title="Nueva nota de débito">
        <Actions />
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
    </Form>
  )
}