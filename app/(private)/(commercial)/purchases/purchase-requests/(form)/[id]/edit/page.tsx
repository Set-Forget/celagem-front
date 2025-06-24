"use client"

import CustomSonner from "@/components/custom-sonner"
import { FormTabs } from "@/components/form-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useGetPurchaseRequestQuery, useUpdatePurchaseRequestMutation } from "@/lib/services/purchase-requests"
import { cn, placeholder } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseDate } from "@internationalized/date"
import { Save, Sticker } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newPurchaseRequestNotesSchema, newPurchaseRequestSchema } from "../../../schemas/purchase-requests"
import GeneralForm from "../../new/components/general-form"
import NotesForm from "../../new/components/notes-form"
import { useSendMessageMutation } from "@/lib/services/telegram"
import { format, parseISO } from "date-fns"

const tabs = [
  {
    value: "tab-1",
    label: "Notas",
    icon: <Sticker size={16} />,
    content: <NotesForm />,
    schema: newPurchaseRequestNotesSchema,
  },
];

export default function Page() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const { data: purchaseRequest, isLoading: isPurchaseRequestLoading } = useGetPurchaseRequestQuery(id!, { skip: !id })

  const [sendMessage] = useSendMessageMutation();
  const [updatePurchaseRequest, { isLoading: isUpdatingPurchaseRequest }] = useUpdatePurchaseRequestMutation()

  const newPurchaseRequest = useForm<z.infer<typeof newPurchaseRequestSchema>>({
    resolver: zodResolver(newPurchaseRequestSchema),
    defaultValues: {
      request_date: "",
      items: [],
      internal_notes: "",
      tyc_notes: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof newPurchaseRequestSchema>) => {
    try {
      const response = await updatePurchaseRequest({
        body: {
          ...data,
          request_date: data.request_date.toString(),
          company: 1
        },
        id: id!
      }).unwrap()

      if (response.status === "success") {
        router.push(`/purchases/purchase-requests/${id}`)
        toast.custom((t) => <CustomSonner t={t} description="Solicitud de pedido actualizada exitosamente" variant="success" />)
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar la solicitud de pedido" variant="error" />)
      sendMessage({
        location: "app/(private)/(commercial)/purchases/purchase-requests/(form)/[id]/edit/page.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      }).unwrap().catch((error) => {
        console.error(error);
      });
    }
  }

  useEffect(() => {
    if (purchaseRequest) {
      newPurchaseRequest.reset({
        request_date: parseDate(format(parseISO(purchaseRequest?.request_date), "yyyy-MM-dd")),
        company: String(purchaseRequest?.company?.id),
        items: purchaseRequest?.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })) || [],
        internal_notes: purchaseRequest?.internal_notes,
        tyc_notes: purchaseRequest?.tyc_notes,
      });
    }
  }, [purchaseRequest]);

  return (
    <Form {...newPurchaseRequest}>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight")}>
          Editar solicitud de compra <span className={cn("transition-all duration-300", isPurchaseRequestLoading ? "blur-[4px]" : "blur-none")}>{isPurchaseRequestLoading ? placeholder(14, true) : purchaseRequest?.sequence_id}</span>
        </h1>
      }>
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newPurchaseRequest.handleSubmit(onSubmit)}
            size="sm"
            loading={isUpdatingPurchaseRequest}
          >
            <Save className={cn(isUpdatingPurchaseRequest && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
    </Form>
  )
}