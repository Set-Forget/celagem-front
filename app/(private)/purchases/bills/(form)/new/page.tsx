"use client"

import CustomSonner from "@/components/custom-sonner"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useCreateBillMutation } from "@/lib/services/bills"
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders"
import { cn, getFieldPaths } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { get } from "lodash"
import { Save, Sticker, Wallet } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newBillFiscalSchema, newBillNotesSchema, newBillSchema } from "../../schemas/bills"
import FiscalForm from "./components/fiscal-form"
import GeneralForm from "./components/general-form"
import NotesForm from "./components/notes-form"

const tabToFieldsMap = {
  "tab-1": getFieldPaths(newBillFiscalSchema),
  "tab-2": getFieldPaths(newBillNotesSchema),
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
  const searchParams = useSearchParams()

  const [tab, setTab] = useState(tabs[0].value)

  const [createBill, { isLoading: isCreatingBill }] = useCreateBillMutation()

  const purchaseOrderId = searchParams.get("purchase_order_id")

  const { data: purchaseOrder } = useGetPurchaseOrderQuery(purchaseOrderId!, { skip: !purchaseOrderId })

  const newBillForm = useForm<z.infer<typeof newBillSchema>>({
    resolver: zodResolver(newBillSchema),
    defaultValues: {
      items: [],
      date: new Date().toISOString(),
      accounting_date: "",
      number: "",
      internal_notes: "",
      tyc_notes: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof newBillSchema>) => {
    try {
      const response = await createBill({
        ...data,
        accounting_date: data.accounting_date.toString(),
        items: data.items.map(({ cost_center_id, ...rest }) => ({
          ...rest,
          cost_centers: cost_center_id ? [{ id: cost_center_id, percentage: 100 }] : [],
          purchase_line_id: purchaseOrder?.items.find((poItem) => poItem.product_id === rest.product_id)?.id,
        })),
        purchase_order_id: purchaseOrderId ? parseInt(purchaseOrderId) : undefined,
      }).unwrap()

      if (response.status === "success") {
        router.push(`/purchases/bills/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Factura de compra creada exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la factura de compra" variant="error" />)
    }
  }

  const onError = (errors: FieldErrors<z.infer<typeof newBillSchema>>) => {
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
    if (purchaseOrder) {
      newBillForm.reset({
        supplier: purchaseOrder.supplier.id,
        date: new Date().toISOString(),
        currency: purchaseOrder.currency.id,
        payment_term: purchaseOrder?.payment_term?.id,
        items: purchaseOrder.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.product_qty,
          taxes_id: item.taxes.map((tax) => tax.id),
          price_unit: item.price_unit
        }))
      })
    }
  }, [purchaseOrder])

  return (
    <Form {...newBillForm}>
      <Header title="Nueva factura de compra">
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newBillForm.handleSubmit(onSubmit, onError)}
            size="sm"
            loading={isCreatingBill}
          >
            <Save className={cn(isCreatingBill && "hidden")} />
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