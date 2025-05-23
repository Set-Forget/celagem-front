"use client"

import CustomSonner from "@/components/custom-sonner"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useCreateDebitNoteMutation, useGetDebitNoteQuery, useUpdateDebitNoteMutation } from "@/lib/services/debit-notes"
import { useGetInvoiceQuery } from "@/lib/services/invoices"
import { cn, getFieldPaths } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save, Sticker, Wallet } from "lucide-react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import DataTabs from "@/components/data-tabs"
import { get } from "lodash"
import { newDebitNoteFiscalSchema, newDebitNoteNotesSchema, newDebitNoteSchema } from "../../../schemas/debit-notes"
import FiscalForm from "../../new/components/fiscal-form"
import NotesForm from "../../new/components/notes-form"
import GeneralForm from "../../new/components/general-form"
import { useGetCreditNoteQuery } from "@/lib/services/credit-notes"
import { parseDate } from "@internationalized/date"

const tabToFieldsMap = {
  "tab-1": getFieldPaths(newDebitNoteFiscalSchema),
  "tab-2": getFieldPaths(newDebitNoteNotesSchema),
}

const tabs = [
  {
    value: "tab-1",
    label: "Fiscal",
    icon: <Wallet className="mr-1.5" size={16} />,
    content: <FiscalForm />
  },
  {
    value: "tab-2",
    label: "Notas",
    icon: <Sticker className="mr-1.5" size={16} />,
    content: <NotesForm />
  }
]

export default function Page() {
  const { id, scope } = useParams<{ id: string, scope: "sales" | "purchases" }>()

  const router = useRouter()

  const [tab, setTab] = useState(tabs[0].value)

  const { data: debitNote, isLoading: isLoadingDebitNote } = useGetDebitNoteQuery(id!, { skip: !id })

  const [createDebitNote, { isLoading: isCreatingDebitNote }] = useUpdateDebitNoteMutation()

  const form = useForm<z.infer<typeof newDebitNoteSchema>>({
    resolver: zodResolver(newDebitNoteSchema),
    defaultValues: {
      number: "",
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

  const onError = (errors: FieldErrors<z.infer<typeof newDebitNoteSchema>>) => {
    for (const [tabKey, fields] of Object.entries(tabToFieldsMap)) {
      const hasError = fields.some((fieldPath) => {
        return get(errors, fieldPath) != null;
      });
      if (hasError) {
        setTab(tabKey);
        break;
      }
    }
  };

  useEffect(() => {
    if (debitNote) {
      form.reset({
        partner: debitNote?.partner?.id,
        currency: debitNote?.currency?.id,
        number: scope === "purchases" ? debitNote?.number : undefined,
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
            onClick={form.handleSubmit(onSubmit, onError)}
            size="sm"
            loading={isCreatingDebitNote}
          >
            <Save className={cn(isCreatingDebitNote && "hidden")} />
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