"use client"

import CustomSonner from "@/components/custom-sonner"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useGetCreditNoteQuery, useUpdateCreditNoteMutation } from "@/lib/services/credit-notes"
import { useLazyGetInvoiceQuery } from "@/lib/services/invoices"
import { useListTaxesQuery } from "@/lib/services/taxes"
import { cn, round } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseDate } from "@internationalized/date"
import { Save, Sticker } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newCreditNoteSchema } from "../../../schemas/credit-notes"
import GeneralForm from "../../new/components/general-form"
import NotesForm from "../../new/components/notes-form"

const tabs = [
  {
    value: "tab-1",
    label: "Notas",
    icon: <Sticker className="mr-1.5" size={16} />,
    content: <NotesForm />
  }
]

export default function Page() {
  const { id, scope } = useParams<{ id: string, scope: "sales" | "purchases" }>()

  const router = useRouter()

  const [tab, setTab] = useState(tabs[0].value)

  const { data: creditNote, isLoading: isLoadingCreditNote } = useGetCreditNoteQuery(id!, { skip: !id })

  const { data: taxes } = useListTaxesQuery()
  const [getDocument] = useLazyGetInvoiceQuery();

  const [updateCreditNote, { isLoading: isUpdatingCreditNote }] = useUpdateCreditNoteMutation()

  const newCreditNoteForm = useForm<z.infer<typeof newCreditNoteSchema>>({
    resolver: zodResolver(newCreditNoteSchema),
  })

  const onSubmit = async (data: z.infer<typeof newCreditNoteSchema>) => {
    const document = await getDocument(creditNote?.associated_invoice?.id!).unwrap()

    const unitPrices = data.items.map(item => Number(item.price_unit)) || []

    const subtotal = data.items.reduce((acc, item, index) => {
      const price = unitPrices[index] || 0
      return acc + (price * item.quantity)
    }, 0) || 0

    const subtotalTaxes = data.items.reduce((acc, item, index) => {
      const price = unitPrices[index] || 0
      const taxesAmount = item.taxes_id?.map(taxId => taxes?.data.find(tax => tax.id === taxId)?.amount || 0) || []
      return acc + (price * item.quantity * taxesAmount.reduce((acc, tax) => acc + tax, 0) / 100)
    }, 0) || 0

    const creditNoteAmount = subtotal + subtotalTaxes

    const invoiceAmount = document?.items.reduce((acc, item) => {
      return acc + (item.quantity * item.price_unit * (1 + (item.taxes.reduce((acc, tx) => {
        const tax = taxes?.data.find(t => t.id === tx.id)
        return acc + (tax ? tax.amount : 0)
      }, 0) / 100)))
    }, 0) || 0

    if (round(creditNoteAmount) > round(invoiceAmount)) return toast.custom((t) => <CustomSonner t={t} description="El monto de la nota de crédito no puede ser mayor al monto de la factura" variant="error" />)

    try {
      const response = await updateCreditNote({
        body: {
          ...data,
          date: data.date.toString(),
          accounting_date: data.accounting_date.toString(),
          items: data.items.map((item) => ({
            quantity: item.quantity,
            product_id: item.product_id,
            taxes_id: item?.taxes_id,
            price_unit: item.price_unit,
          })),
        },
        id: id!
      }).unwrap()

      if (response.status === "success") {
        router.push(`/${scope}/credit-notes/${id}`)
        toast.custom((t) => <CustomSonner t={t} description="Nota de crédito actualizada exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar la nota de crédito" variant="error" />)
    }
  }

  useEffect(() => {
    if (creditNote) {
      newCreditNoteForm.reset({
        partner: creditNote?.partner?.id,
        currency: creditNote?.currency?.id,
        number: scope === "purchases" ? creditNote?.number : undefined,
        date: creditNote?.date && parseDate(creditNote.date),
        accounting_date: creditNote?.accounting_date && parseDate(creditNote.accounting_date),
        internal_notes: creditNote?.internal_notes || "",
        items: creditNote?.items?.map((item) => ({
          product_id: item?.product_id,
          quantity: item?.quantity,
          price_unit: item?.price_unit,
          taxes_id: item?.taxes.map((tax) => tax.id),
        })) || [],
      })
    }
  }, [creditNote])

  return (
    <Form {...newCreditNoteForm}>
      <Header title="Editar nota de crédito">
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newCreditNoteForm.handleSubmit(onSubmit)}
            size="sm"
            loading={isUpdatingCreditNote}
          >
            <Save className={cn(isUpdatingCreditNote && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <GeneralForm />
      <DataTabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        triggerClassName="mt-4"
        // ? data-[state=inactive]:hidden se usa para ocultar el contenido de las tabs que no estén activas, esto es necesario porque forceMount hace que el contenido de todas las tabs se monte al mismo tiempo.
        contentClassName="data-[state=inactive]:hidden"
        // ? forceMount se usa para que el contenido de las tabs no se desmonte al cambiar de tab, esto es necesario para que los errores de validación no se pierdan al cambiar de tab.
        forceMount
      />
    </Form>
  )
}