"use client"

import { Save, Sticker, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import CustomSonner from "@/components/custom-sonner"
import { FormTabs } from "@/components/form-tabs"
import Header from "@/components/header"
import { Form } from "@/components/ui/form"
import { useCreateInvoiceMutation } from "@/lib/services/invoices"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newInvoiceFiscalSchema, newInvoiceNotesSchema, newInvoiceSchema } from "../../schemas/invoices"
import FiscalForm from "./components/fiscal-form"
import GeneralForm from "./components/general-form"
import NotesForm from "./components/notes-form"
import { useSendMessageMutation } from "@/lib/services/telegram"

const tabs = [
  {
    value: "tab-1",
    label: "Fiscal",
    icon: <Wallet size={16} />,
    content: <FiscalForm />,
    schema: newInvoiceFiscalSchema,
  },
  {
    value: "tab-2",
    label: "Otros",
    icon: <Sticker size={16} />,
    content: <NotesForm />,
    schema: newInvoiceNotesSchema,
  }
]

export default function Page() {
  const router = useRouter()

  const [sendMessage] = useSendMessageMutation();
  const [createInvoice, { isLoading: isCreatingInvoice }] = useCreateInvoiceMutation()

  const newInvoiceForm = useForm<z.infer<typeof newInvoiceSchema>>({
    resolver: zodResolver(newInvoiceSchema),
    defaultValues: {
      items: [],
      accounting_date: "",
      internal_notes: "",
      tyc_notes: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof newInvoiceSchema>) => {
    try {
      const response = await createInvoice({
        ...data,
        accounting_date: data.accounting_date.toString(),
        date: data.date.toString(),
        items: data.items.map((item) => ({
          ...item,
          cost_center: item.cost_center || undefined
        }))
      }).unwrap()

      if (response.status === "success") {
        router.push(`/sales/invoices/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Factura de venta creada exitosamente" />)
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la factura de venta" variant="error" />)
      sendMessage({
        location: "app/(private)/(commercial)/sales/invoices/(form)/new/page.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      }).unwrap().catch((error) => {
        console.error(error);
      });
    }
  }

  return (
    <Form {...newInvoiceForm}>
      <Header title="Nueva factura de venta">
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newInvoiceForm.handleSubmit(onSubmit)}
            size="sm"
            loading={isCreatingInvoice}
          >
            <Save className={cn(isCreatingInvoice && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
    </Form>
  )
}