"use client"

import CustomSonner from "@/components/custom-sonner"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useCreateDebitNoteMutation } from "@/lib/services/debit-notes"
import { useGetInvoiceQuery } from "@/lib/services/invoices"
import { cn, getFieldPaths, placeholder } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, Save, Sticker, Wallet } from "lucide-react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
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
import { Separator } from "@/components/ui/separator"
import { useGetBillQuery } from "@/lib/services/bills"
import { parseDate } from "@internationalized/date"
import { format } from "date-fns"

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
  const { scope } = useParams<{ scope: "sales" | "purchases" }>()

  const router = useRouter()
  const params = useSearchParams()

  const invoiceId = params.get("invoiceId");
  const billId = params.get("billId");

  const [tab, setTab] = useState(tabs[0].value)

  const [createDebitNote, { isLoading: isCreatingDebitNote }] = useCreateDebitNoteMutation()

  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(invoiceId ?? "", {
    skip: !invoiceId
  });
  const { data: bill, isLoading: isBillLoading } = useGetBillQuery(billId ?? "", {
    skip: !billId
  });

  const { id: partyId, name: partyName } = (invoice?.customer || bill?.supplier) || {}

  const document = invoice || bill
  const isDocumentLoading = isInvoiceLoading || isBillLoading

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
        date: data.date.toString(),
      }).unwrap()

      if (response.status === "success") {
        router.push(`/${scope}/debit-notes/${response.data.id}`)
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
      const moveType = scope === "purchases" ? "in_invoice" : "out_invoice"
      newDebitNoteForm.reset({
        partner: scope === "purchases" ? bill?.supplier.id : invoice?.customer.id,
        currency: document.currency.id,
        move_type: moveType,
        associated_invoice: document.id,
        payment_term: document.payment_term?.id,
        payment_method: document.payment_method?.id,
        tyc_notes: document.tyc_notes || "",
        date: scope === "sales" ? parseDate(format(new Date(), "yyyy-MM-dd")) : undefined,
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Factura</label>
          <div className="flex gap-2 items-center group w-fit">
            <span className={cn("text-sm font-medium tracking-tight transition-all duration-300", isDocumentLoading ? "blur-[4px]" : "blur-none")}>
              {isDocumentLoading ? placeholder(20, true) : document?.number}
            </span>
            <Button
              variant="outline"
              size="icon"
              className={cn("w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity", isDocumentLoading && "hidden")}
              onClick={() => router.push(`/purchases/bills/${document?.id}`)}
            >
              <Eye />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Contacto</label>
          <div className="flex gap-2 items-center group w-fit">
            <span className={cn("text-sm font-medium tracking-tight transition-all duration-300", isDocumentLoading ? "blur-[4px]" : "blur-none")}>
              {isDocumentLoading ? placeholder(20, true) : partyName}
            </span>
            <Button
              variant="outline"
              size="icon"
              className={cn("w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity", isDocumentLoading && "hidden")}
              onClick={() => router.push(`/purchases/vendors/${partyId}`)}
            >
              <Eye />
            </Button>
          </div>
        </div>
      </div>
      <Separator className="col-span-full" />
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