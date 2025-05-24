"use client"

import { Save, Sticker, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn, getFieldPaths } from "@/lib/utils"

import CustomSonner from "@/components/custom-sonner"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Form } from "@/components/ui/form"
import { useGetInvoiceQuery, useUpdateInvoiceMutation } from "@/lib/services/invoices"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseDate } from "@internationalized/date"
import { get } from "lodash"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newInvoiceFiscalSchema, newInvoiceNotesSchema, newInvoiceSchema } from "../../../schemas/invoices"
import FiscalForm from "../../new/components/fiscal-form"
import GeneralForm from "../../new/components/general-form"
import NotesForm from "../../new/components/notes-form"

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
  const { id } = useParams<{ id: string }>()

  const router = useRouter()

  const [tab, setTab] = useState(tabs[0].value)

  const { data: invoice, isLoading: isLoadingBill } = useGetInvoiceQuery(id!, { skip: !id })

  const [updateInvoice, { isLoading: isUpdatingInvoice }] = useUpdateInvoiceMutation()

  const form = useForm<z.infer<typeof newInvoiceSchema>>({
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
      const response = await updateInvoice({
        body: {
          ...data,
          accounting_date: data.accounting_date.toString()
        },
        id: id!
      }).unwrap()

      if (response.status === "success") {
        router.push(`/sales/invoices/${id}`)
        toast.custom((t) => <CustomSonner t={t} description="Factura de venta actualizada exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar la factura de venta" variant="error" />)
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

  useEffect(() => {
    if (invoice) {
      form.reset({
        customer: invoice?.customer?.id,
        date: invoice?.date,
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
    }
  }, [invoice])

  return (
    <Form {...form}>
      <Header title="Nueva factura de venta">
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit, onError)}
            size="sm"
            loading={isUpdatingInvoice}
          >
            <Save className={cn(isUpdatingInvoice && "hidden")} />
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