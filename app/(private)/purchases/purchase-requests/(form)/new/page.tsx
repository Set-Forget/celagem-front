"use client"

import CustomSonner from "@/components/custom-sonner"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useCreatePurchaseRequestMutation } from "@/lib/services/purchase-requests"
import { cn, getFieldPaths } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save, Sticker } from "lucide-react"
import { useRouter } from "next/navigation"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newPurchaseRequestNotesSchema, newPurchaseRequestSchema } from "../../schemas/purchase-requests"
import GeneralForm from "./components/general-form"
import DataTabs from "@/components/data-tabs"
import { get } from "lodash"
import { useState } from "react"
import NotesForm from "./components/notes-form"

const tabToFieldsMap = {
  "tab-1": getFieldPaths(newPurchaseRequestNotesSchema),
}

const tabs = [
  {
    value: "tab-1",
    label: "Notas",
    icon: <Sticker className="mr-1.5" size={16} />,
    content: <NotesForm />
  },
];

export default function Page() {
  const router = useRouter()

  const [tab, setTab] = useState(tabs[0].value)

  const [createPurchaseRequest, { isLoading: isCreatingPurchaseRequest }] = useCreatePurchaseRequestMutation()

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
      const response = await createPurchaseRequest({
        ...data,
        request_date: data.request_date.toString(),
        company: 1
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

  const onError = (errors: FieldErrors<z.infer<typeof newPurchaseRequestSchema>>) => {
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
    <Form {...newPurchaseRequest}>
      <Header title="Nueva solicitud de compra">
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newPurchaseRequest.handleSubmit(onSubmit, onError)}
            size="sm"
            loading={isCreatingPurchaseRequest}
          >
            <Save className={cn(isCreatingPurchaseRequest && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <GeneralForm />
      <DataTabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        // ? data-[state=inactive]:hidden se usa para ocultar el contenido de las tabs que no estén activas, esto es necesario porque forceMount hace que el contenido de todas las tabs se monte al mismo tiempo.
        contentClassName="data-[state=inactive]:hidden"
        // ? forceMount se usa para que el contenido de las tabs no se desmonte al cambiar de tab, esto es necesario para que los errores de validación no se pierdan al cambiar de tab.
        forceMount
        triggerClassName="mt-4"
      />
    </Form>
  )
}