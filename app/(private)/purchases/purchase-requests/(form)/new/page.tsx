"use client"

import CustomSonner from "@/components/custom-sonner"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useCreatePurchaseRequestMutation } from "@/lib/services/purchase-requests"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newPurchaseRequestSchema } from "../../schemas/purchase-requests"
import GeneralForm from "../components/general-form"

export default function NewPurchaseRequestPage() {
  const router = useRouter()

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
      <GeneralForm />
    </Form>
  )
}