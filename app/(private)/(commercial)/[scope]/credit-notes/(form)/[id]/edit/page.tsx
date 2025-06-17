"use client"

import CustomSonner from "@/components/custom-sonner"
import { FormTabs } from "@/components/form-tabs"
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
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newCreditNoteSchema } from "../../../schemas/credit-notes"
import GeneralForm from "../../components/general-form"
import NotesForm from "../../components/notes-form"
import { useSendMessageMutation } from "@/lib/services/telegram"

const tabs = [
  {
    value: "tab-1",
    label: "Notas",
    icon: <Sticker size={16} />,
    content: <NotesForm />
  }
]

export default function Page() {
  const { id, scope } = useParams<{ id: string, scope: "sales" | "purchases" }>()

  const router = useRouter()

  const { data: creditNote, isLoading: isLoadingCreditNote } = useGetCreditNoteQuery(id!, { skip: !id })

  const [updateCreditNote, { isLoading: isUpdatingCreditNote }] = useUpdateCreditNoteMutation()
  const [sendMessage] = useSendMessageMutation();

  const newCreditNoteForm = useForm<z.infer<typeof newCreditNoteSchema>>({
    resolver: zodResolver(newCreditNoteSchema),
    defaultValues: {
      custom_sequence_number: scope === "purchases" ? "" : undefined,
    }
  })

  const onSubmit = async (data: z.infer<typeof newCreditNoteSchema>) => {
    try {
      const response = await updateCreditNote({
        body: {
          ...data,
          date: data.date.toString(),
          accounting_date: data.accounting_date.toString()
        },
        id: id!
      }).unwrap()

      if (response.status === "success") {
        router.push(`/${scope}/credit-notes/${id}`)
        toast.custom((t) => <CustomSonner t={t} description="Nota de crédito actualizada exitosamente" />)
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar la nota de crédito" variant="error" />)
      sendMessage({
        location: "app/(private)/(commercial)/[scope]/credit-notes/(form)/[id]/edit/page.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      })
    }
  }

  useEffect(() => {
    if (creditNote) {
      newCreditNoteForm.reset({
        partner: creditNote?.partner?.id,
        currency: creditNote?.currency?.id,
        custom_sequence_number: scope === "purchases" ? creditNote?.number : undefined,
        date: creditNote?.date && parseDate(creditNote.date),
        accounting_date: creditNote?.accounting_date && parseDate(creditNote.accounting_date),
        internal_notes: creditNote?.internal_notes || "",
        items: creditNote?.items?.map((item) => ({
          product_id: item?.product_id,
          quantity: item?.quantity,
          price_unit: item?.price_unit,
          taxes_id: item?.taxes.map((tax) => tax.id),
          cost_center: item?.cost_center?.id,
          account_id: item?.account?.id,
        })) || [],
      })
    }
  }, [creditNote])

  return (
    <Form {...newCreditNoteForm}>
      <Header title={`Editar nota de crédito ${creditNote?.sequence_id}`}>
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
      <FormTabs tabs={tabs} />
    </Form>
  )
}