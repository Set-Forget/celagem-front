"use client"


import CustomSonner from "@/components/custom-sonner"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useCreateDebitNoteMutation } from "@/lib/services/debit-notes"
import { useGetInvoiceQuery } from "@/lib/services/invoices"
import { cn, getFieldPaths } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save, Sticker, Wallet } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newDebitNoteFiscalSchema, newDebitNoteNotesSchema, newDebitNoteSchema } from "../../schemas/debit-notes"
import GeneralForm from "./components/general-form"
import FiscalForm from "./components/fiscal-form"
import NotesForm from "./components/notes-form"
import DataTabs from "@/components/data-tabs"
import { get } from "lodash"

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
  const router = useRouter()
  const params = useSearchParams()

  const invoiceId = params.get("invoiceId");
  const billId = params.get("billId");

  const [tab, setTab] = useState(tabs[0].value)

  const { data: document } = useGetInvoiceQuery(invoiceId ?? billId ?? "", {
    skip: !invoiceId && !billId,
  });

  const [createDebitNote, { isLoading: isCreatingDebitNote }] = useCreateDebitNoteMutation()

  const newDebitNoteForm = useForm<z.infer<typeof newDebitNoteSchema>>({
    resolver: zodResolver(newDebitNoteSchema),
    defaultValues: {
      number: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof newDebitNoteSchema>) => {
    try {
      const response = await createDebitNote({
        ...data,
        accounting_date: data.accounting_date.toString(),
      }).unwrap()

      if (response.status === "success") {
        router.push(`/debit-notes/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Nota de débito creada con éxito" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la nota de débito" variant="error" />)
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
    if (document) {
      const moveType = billId ? "in_invoice" : "out_invoice"
      newDebitNoteForm.reset({
        partner: document.customer.id,
        currency: document.currency.id,
        move_type: moveType,
        associated_invoice: document.id,
        payment_term: document.payment_term?.id,
        payment_method: document.payment_method?.id,
        tyc_notes: document.tyc_notes || "",
        date: new Date().toISOString(),
        items: []
      })
    }
  }, [document])

  return (
    <Form {...newDebitNoteForm}>
      <Header title="Nueva nota de débito">
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newDebitNoteForm.handleSubmit(onSubmit, onError)}
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