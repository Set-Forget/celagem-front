"use client"

import { Save, Sticker, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn, getFieldPaths } from "@/lib/utils"

import CustomSonner from "@/components/custom-sonner"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Form } from "@/components/ui/form"
import { useCreateInvoiceMutation } from "@/lib/services/invoices"
import { zodResolver } from "@hookform/resolvers/zod"
import { get } from "lodash"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newInvoiceFiscalSchema, newInvoiceNotesSchema, newInvoiceSchema } from "../../schemas/invoices"
import FiscalForm from "./components/fiscal-form"
import NotesForm from "./components/notes-form"
import GeneralForm from "./components/general-form"

const tabToFieldsMap = {
  "tab-1": getFieldPaths(newInvoiceFiscalSchema),
  "tab-2": getFieldPaths(newInvoiceNotesSchema),
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
    label: "Otros",
    icon: <Sticker className="mr-1.5" size={16} />,
    content: < NotesForm />
  }
]

export default function Page() {
  const router = useRouter()

  const [tab, setTab] = useState(tabs[0].value)

  const [createInvoice, { isLoading: isCreatingInvoice }] = useCreateInvoiceMutation()

  const newInvoiceForm = useForm<z.infer<typeof newInvoiceSchema>>({
    resolver: zodResolver(newInvoiceSchema),
    defaultValues: {
      items: [],
      date: new Date().toISOString(),
      accounting_date: "",
      internal_notes: "",
      tyc_notes: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof newInvoiceSchema>) => {
    try {
      const response = await createInvoice({
        ...data,
        accounting_date: data.accounting_date.toString()
      }).unwrap()

      if (response.status === "success") {
        router.push(`/sales/invoices/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Factura de venta creada exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la factura de venta" variant="error" />)
    }
  }

  const onError = (errors: FieldErrors<z.infer<typeof newInvoiceSchema>>) => {
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

  return (
    <Form {...newInvoiceForm}>
      <Header title="Nueva factura de venta">
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newInvoiceForm.handleSubmit(onSubmit, onError)}
            size="sm"
            loading={isCreatingInvoice}
          >
            <Save className={cn(isCreatingInvoice && "hidden")} />
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