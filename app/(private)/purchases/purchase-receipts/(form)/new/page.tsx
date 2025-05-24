"use client"

import CustomSonner from "@/components/custom-sonner"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders"
import { useCreatePurchaseReceiptMutation } from "@/lib/services/purchase-receipts"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save, Sticker } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newPurchaseReceiptSchema } from "../../schemas/purchase-receipts"
import GeneralForm from "./components/general-form"
import NotesForm from "./components/notes-form"
import { format, parseISO } from "date-fns"

const tabs = [
  {
    value: "tab-1",
    label: "Notas",
    icon: <Sticker className="mr-1.5" size={16} />,
    content: <NotesForm />
  }
]

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [tab, setTab] = useState(tabs[0].value)

  const purchaseOrderId = searchParams.get("purchase_order_id")

  const { data: purchaseOrder } = useGetPurchaseOrderQuery(purchaseOrderId!, { skip: !purchaseOrderId })
  const [createPurchaseReceipt, { isLoading: isCreatingPurchaseReceipt }] = useCreatePurchaseReceiptMutation()

  const newPurchaseReceipt = useForm<z.infer<typeof newPurchaseReceiptSchema>>({
    resolver: zodResolver(newPurchaseReceiptSchema),
    defaultValues: {
      items: []
    }
  })

  const onSubmit = async (data: z.infer<typeof newPurchaseReceiptSchema>) => {
    const { purchase_order, ...rest } = data

    try {
      const response = await createPurchaseReceipt({
        ...rest,
        reception_date: rest.reception_date.toString(),
      }).unwrap()

      if (response.status === "success") {
        router.push(`/purchases/purchase-receipts/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Recepción de compra creada exitosamente" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la recepción de compra" variant="error" />)
    }
  }

  console.log(purchaseOrder)

  useEffect(() => {
    if (purchaseOrder) {
      newPurchaseReceipt.reset({
        supplier: purchaseOrder.supplier.id,
        purchase_order: purchaseOrder.id,
        scheduled_date: format(parseISO(purchaseOrder.required_date), "yyyy-MM-dd"),
        move_type: "direct",
        items: purchaseOrder.items.map((item) => ({
          product_id: item.product_id,
          name: item.product_name, // ! No debería ser necesario. Esto es un bug en el backend, debería venir en el item.
          purchase_line_id: item.id,
          quantity: item.product_qty,
          product_uom: item.product_uom.id,
        }))
      })
    }
  }, [purchaseOrder])

  return (
    <Form {...newPurchaseReceipt}>
      <Header title="Nueva recepción de compra" >
        <div className="flex justify-end gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newPurchaseReceipt.handleSubmit(onSubmit)}
            loading={isCreatingPurchaseReceipt}
            size="sm"
          >
            <Save className={cn(isCreatingPurchaseReceipt && "hidden")} />
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