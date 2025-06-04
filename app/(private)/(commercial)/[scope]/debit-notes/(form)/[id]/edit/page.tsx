"use client"

import CustomSonner from "@/components/custom-sonner"
import { FormTabs } from "@/components/form-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useGetDebitNoteQuery, useUpdateDebitNoteMutation } from "@/lib/services/debit-notes"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseDate } from "@internationalized/date"
import { Save, Sticker, Wallet } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newDebitNoteFiscalSchema, newDebitNoteNotesSchema, newDebitNoteSchema } from "../../../schemas/debit-notes"
import FiscalForm from "../../components/fiscal-form"
import GeneralForm from "../../components/general-form"
import NotesForm from "../../components/notes-form"

const tabs = [
  {
    value: "tab-1",
    label: "Fiscal",
    icon: <Wallet size={16} />,
    content: <FiscalForm />,
    schema: newDebitNoteFiscalSchema,
  },
  {
    value: "tab-2",
    label: "Notas",
    icon: <Sticker size={16} />,
    content: <NotesForm />,
    schema: newDebitNoteNotesSchema,
  }
]

export default function Page() {
  const { id, scope } = useParams<{ id: string, scope: "sales" | "purchases" }>()

  const router = useRouter()

  const { data: debitNote, isLoading: isLoadingDebitNote } = useGetDebitNoteQuery(id!, { skip: !id })

  const [createDebitNote, { isLoading: isCreatingDebitNote }] = useUpdateDebitNoteMutation()

  const form = useForm<z.infer<typeof newDebitNoteSchema>>({
    resolver: zodResolver(newDebitNoteSchema),
    defaultValues: {
      custom_sequence_number: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof newDebitNoteSchema>) => {
    try {
      const response = await createDebitNote({
        body: {
          ...data,
          accounting_date: data.accounting_date.toString(),
          date: data.date.toString(),
        },
        id: id
      }).unwrap()

      if (response.status === "success") {
        router.push(`/${scope}/debit-notes/${id}`)
        toast.custom((t) => <CustomSonner t={t} description="Nota de débito actualizada con éxito" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar la nota de débito" variant="error" />)
    }
  }

  useEffect(() => {
    if (debitNote) {
      form.reset({
        partner: debitNote?.partner?.id,
        currency: debitNote?.currency?.id,
        custom_sequence_number: scope === "purchases" ? debitNote?.custom_sequence_number : undefined,
        date: debitNote?.date && parseDate(debitNote.date),
        accounting_date: debitNote?.accounting_date && parseDate(debitNote.accounting_date),
        payment_method: debitNote?.payment_method?.id,
        payment_term: debitNote?.payment_term?.id,
        internal_notes: debitNote?.internal_notes || "",
        items: debitNote?.items?.map((item) => ({
          product_id: item?.product_id,
          quantity: item?.quantity,
          price_unit: item?.price_unit,
          cost_center: item?.cost_center?.id,
          account_id: item?.account.id,
          taxes_id: item?.taxes.map((tax) => tax.id),
        })) || [],
      })
    }
  }, [debitNote])

  return (
    <Form {...form}>
      <Header title="Editar nota de débito">
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            size="sm"
            loading={isCreatingDebitNote}
          >
            <Save className={cn(isCreatingDebitNote && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
    </Form>
  )
}