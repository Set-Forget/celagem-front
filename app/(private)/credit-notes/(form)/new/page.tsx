"use client"

import CustomSonner from "@/components/custom-sonner"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useCreateCreditNoteMutation } from "@/lib/services/credit-notes"
import { useGetInvoiceQuery } from "@/lib/services/invoices"
import { cn, round } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save, Sticker } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newCreditNoteSchema } from "../../schemas/credit-notes"
import GeneralForm from "./components/general-form"
import NotesForm from "./components/notes-form"
import DataTabs from "@/components/data-tabs"
import { useListTaxesQuery } from "@/lib/services/taxes"

const tabs = [
  {
    value: "tab-1",
    label: "Notas",
    icon: <Sticker className="mr-1.5" size={16} />,
    content: <NotesForm />
  }
]

export default function Page() {
  const router = useRouter()
  const params = useSearchParams()

  const invoiceId = params.get("invoiceId");
  const billId = params.get("billId");

  const [tab, setTab] = useState(tabs[0].value)

  const { data: taxes } = useListTaxesQuery()
  const { data: document } = useGetInvoiceQuery(invoiceId ?? billId ?? "", {
    skip: !invoiceId && !billId,
  });

  const [createCreditNote, { isLoading: isCreatingCreditNote }] = useCreateCreditNoteMutation()

  const newCreditNoteForm = useForm<z.infer<typeof newCreditNoteSchema>>({
    resolver: zodResolver(newCreditNoteSchema),
  })

  const onSubmit = async (data: z.infer<typeof newCreditNoteSchema>) => {
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
      const response = await createCreditNote({
        ...data,
        items: data.items.map((item) => ({
          quantity: item.quantity,
          product_id: item.product_id,
          taxes_id: item?.taxes_id,
          price_unit: item.price_unit,
        })),
      }).unwrap()

      if (response.status === "success") {
        router.push(`/credit-notes/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Nota de crédito creada exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la nota de crédito" variant="error" />)
    }
  }

  useEffect(() => {
    if (document) {
      const moveType = billId ? "in_refund" : "out_refund"
      newCreditNoteForm.reset({
        partner: document.customer.id,
        currency: document.currency.id,
        move_type: moveType,
        associated_invoice: document.id,
        date: new Date().toISOString(),
        items: document.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          taxes_id: item.taxes.map((tax) => tax.id),
          price_unit: item.price_unit
        }))
      })
    }
  }, [document])

  return (
    <Form {...newCreditNoteForm}>
      <Header title="Nueva nota de crédito">
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newCreditNoteForm.handleSubmit(onSubmit)}
            size="sm"
            loading={isCreatingCreditNote}
          >
            <Save className={cn(isCreatingCreditNote && "hidden")} />
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