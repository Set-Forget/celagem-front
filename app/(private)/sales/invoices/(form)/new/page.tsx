"use client"

import { Ellipsis, House, Save } from "lucide-react"

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
import { newInvoiceGeneralSchema, newInvoiceOthersSchema, newInvoiceSchema } from "../../schemas/invoices"
import GeneralForm from "./components/general-form"
import OthersForm from "./components/others-form"

const tabToFieldsMap = {
  "tab-1": getFieldPaths(newInvoiceGeneralSchema),
  "tab-2": getFieldPaths(newInvoiceOthersSchema),
}

const tabs = [
  {
    value: "tab-1",
    label: "General",
    icon: <House className="mr-1.5" size={16} />,
    content: <GeneralForm />
  },
  {
    value: "tab-2",
    label: "Otros",
    icon: <Ellipsis className="mr-1.5" size={16} />,
    content: <OthersForm />
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
    const { accounting_account, cost_center, ...rest } = data
    try {
      const response = await createInvoice({
        ...rest,
        number: `FA-${Math.floor(Math.random() * 100000)}`,
        accounting_date: rest.accounting_date.toString(),
        payment_method: 1,
        items: data.items.map((item) => ({
          quantity: item.quantity,
          product_id: item.product_id,
          taxes_id: item?.taxes_id,
          // price_unit: item.price_unit, // ! No se envía el precio unitario porque aún no existe en el backend.
        })),
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