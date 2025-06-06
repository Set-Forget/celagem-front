"use client"

import { Save, Sticker, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import CustomSonner from "@/components/custom-sonner"
import { FormTabs } from "@/components/form-tabs"
import Header from "@/components/header"
import { Form } from "@/components/ui/form"
import { useGetInvoiceQuery, useUpdateInvoiceMutation } from "@/lib/services/invoices"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseDate } from "@internationalized/date"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newInvoiceFiscalSchema, newInvoiceNotesSchema, newInvoiceSchema } from "../../../schemas/invoices"
import FiscalForm from "../../new/components/fiscal-form"
import GeneralForm from "../../new/components/general-form"
import NotesForm from "../../new/components/notes-form"
import { useSendMessageMutation } from "@/lib/services/telegram"

const tabs = [
  {
    value: "tab-1",
    label: "Fiscal",
    icon: <Wallet size={16} />,
    content: <FiscalForm />,
    schema: newInvoiceFiscalSchema,
  },
  {
    value: "tab-2",
    label: "Otros",
    icon: <Sticker size={16} />,
    content: < NotesForm />,
    schema: newInvoiceNotesSchema,
  }
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const router = useRouter()

  const { data: invoice, isLoading: isLoadingBill } = useGetInvoiceQuery(id!, { skip: !id })

  const [sendMessage] = useSendMessageMutation();
  const [updateInvoice, { isLoading: isUpdatingInvoice }] = useUpdateInvoiceMutation()

  const form = useForm<z.infer<typeof newInvoiceSchema>>({
    resolver: zodResolver(newInvoiceSchema),
    defaultValues: {
      items: [],
      date: "",
      accounting_date: "",
      internal_notes: "",
      tyc_notes: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof newInvoiceSchema>) => {
    try {
      const response = await updateInvoice({
        body: {
          ...data,
          accounting_date: data.accounting_date.toString(),
          date: data.date.toString(),
        },
        id: id!
      }).unwrap()

      if (response.status === "success") {
        router.push(`/sales/invoices/${id}`)
        toast.custom((t) => <CustomSonner t={t} description="Factura de venta actualizada exitosamente" />)
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar la factura de venta" variant="error" />)
      sendMessage({
        location: "app/(private)/(commercial)/sales/invoices/(form)/[id]/edit/page.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      }).unwrap().catch((error) => {
        console.error(error);
      });
    }
  }

  useEffect(() => {
    if (!invoice) return
    console.log(invoice)
    form.reset({
      customer: invoice?.customer?.id,
      date: invoice?.date && parseDate(invoice.date),
      accounting_date: invoice?.accounting_date && parseDate(invoice.accounting_date),
      currency: invoice?.currency?.id,
      payment_term: invoice?.payment_term?.id,
      payment_method: invoice?.payment_method?.id,
      internal_notes: typeof invoice?.internal_notes === "string" ? invoice.internal_notes : "",
      tyc_notes: typeof invoice?.tyc_notes === "string" ? invoice.tyc_notes : "",
      items: invoice?.items?.map((item) => ({
        product_id: item?.product_id,
        quantity: item?.quantity,
        price_unit: item?.price_unit,
        account_id: item?.account.id,
        cost_center: item?.cost_center?.id,
        taxes_id: item?.taxes.map((tax) => tax.id),
      })) || [],
    })
  }, [invoice])

  return (
    <Form {...form}>
      <Header title="Editar factura de venta">
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            size="sm"
            loading={isUpdatingInvoice}
          >
            <Save className={cn(isUpdatingInvoice && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
    </Form>
  )
}