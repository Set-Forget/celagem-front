"use client"

import { Box, CalendarIcon, House, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { v4 as uuidv4 } from 'uuid'
import ItemsTable from "./components/items-table"
import DataTabs from "@/components/data-tabs"
import { useEffect, useState } from "react"
import { newPurchaseReceiptSchema } from "../../schemas/purchase-receipts"
import GeneralForm from "./components/general-form"
import { useRouter, useSearchParams } from "next/navigation"
import { useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders"
import { toast } from "sonner"
import CustomSonner from "@/components/custom-sonner"
import { useCreatePurchaseReceiptMutation } from "@/lib/services/purchase-receipts"

const tabs = [
  {
    value: "tab-1",
    label: "General",
    icon: <House className="mr-1.5" size={16} />,
    content: <GeneralForm />
  }
]

export default function NewPurchaseReceivePage() {
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
    try {
      const response = await createPurchaseReceipt({
        ...data,
        reception_date: data.reception_date.toString(),
        reception_location: 1, // ! A modo de prueba se está enviando un valor fijo
        source_location: 1, // ! A modo de prueba se está enviando un valor fijo
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

  useEffect(() => {
    if (purchaseOrder) {
      newPurchaseReceipt.reset({
        supplier: purchaseOrder.supplier.id,
        move_type: "direct",
        items: purchaseOrder.items.map((item) => ({
          product_id: item.product_id,
          name: item.product_name, // ! Esto no debería existir
          purchase_line_id: item.id,
          quantity: item.product_qty,
          product_uom: 1,
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