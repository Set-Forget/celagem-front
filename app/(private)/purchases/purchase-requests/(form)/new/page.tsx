"use client"

import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { House, Paperclip, Save } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newPurchaseRequestSchema } from "../../schemas/purchase-requests"
import GeneralForm from "../components/general-form"
import CustomSonner from "@/components/custom-sonner"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCreatePurchaseRequestMutation } from "@/lib/services/purchase-requests"
import { cn } from "@/lib/utils"

const tabs = [
  {
    value: "tab-1",
    label: "General",
    icon: <House className="mr-1.5" size={16} />,
    content: <GeneralForm />
  }
]

export default function NewPurchaseRequestPage() {
  const router = useRouter()

  const [tab, setTab] = useState('tab-1')

  const [createPurchaseRequest, { isLoading: isCreatingPurchaseRequest }] = useCreatePurchaseRequestMutation()

  const newPurchaseRequest = useForm<z.infer<typeof newPurchaseRequestSchema>>({
    resolver: zodResolver(newPurchaseRequestSchema),
    defaultValues: {
      name: "",
      request_date: "",
      items: [],
      notes: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof newPurchaseRequestSchema>) => {
    try {
      const response = await createPurchaseRequest({
        ...data,
        request_date: data.request_date.toString(),
      }).unwrap()

      if (response.status === "success") {
        router.push(`/purchases/purchase-requests/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Solicitud de pedido creada exitosamente" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la solicitud de pedido" variant="error" />)
    }
  }

  return (
    <Form {...newPurchaseRequest}>
      <Header title="Nueva solicitud de compra">
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newPurchaseRequest.handleSubmit(onSubmit)}
            size="sm"
            loading={isCreatingPurchaseRequest}
          >
            <Save className={cn(isCreatingPurchaseRequest && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <DataTabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        triggerClassName="mt-4"
      />
    </Form>
  )
}