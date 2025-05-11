"use client"

import CustomSonner from "@/components/custom-sonner"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useCreateCreditNoteMutation } from "@/lib/services/credit-notes"
import { useGetInvoiceQuery } from "@/lib/services/invoices"
import { cn } from "@/lib/utils"
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

  const { data: document } = useGetInvoiceQuery(invoiceId ?? billId ?? "", {
    skip: !invoiceId && !billId,
  });

  const [createCreditNote, { isLoading: isCreatingCreditNote }] = useCreateCreditNoteMutation()

  const newCreditNoteForm = useForm<z.infer<typeof newCreditNoteSchema>>({
    resolver: zodResolver(newCreditNoteSchema),
  })

  const onSubmit = async (data: z.infer<typeof newCreditNoteSchema>) => {
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