"use client"

import CustomSonner from "@/components/custom-sonner"
import { FormTabs } from "@/components/form-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useGetBillQuery, useUpdateBillMutation } from "@/lib/services/bills"
import { useSendMessageMutation } from "@/lib/services/telegram"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseDate } from "@internationalized/date"
import { Save, Sticker, Wallet } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newBillFiscalSchema, newBillNotesSchema, newBillSchema } from "../../../schemas/bills"
import FiscalForm from "../../components/fiscal-form"
import GeneralForm from "../../components/general-form"
import NotesForm from "../../components/notes-form"

const tabs = [
  {
    value: "tab-1",
    label: "Fiscal",
    icon: <Wallet size={16} />,
    content: <FiscalForm />,
    schema: newBillFiscalSchema,
  },
  {
    value: "tab-2",
    label: "Notas",
    icon: <Sticker size={16} />,
    content: <NotesForm />,
    schema: newBillNotesSchema,
  }
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const router = useRouter()

  const { data: bill, isLoading: isLoadingBill } = useGetBillQuery(id!, { skip: !id })

  const [sendMessage] = useSendMessageMutation();
  const [updateBill, { isLoading: isUpdatingBill }] = useUpdateBillMutation()

  const newBillForm = useForm<z.infer<typeof newBillSchema>>({
    resolver: zodResolver(newBillSchema),
    defaultValues: {
      items: [],
      date: "",
      accounting_date: "",
      custom_sequence_number: "",
      internal_notes: "",
      tyc_notes: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof newBillSchema>) => {
    try {
      const response = await updateBill({
        body: {
          ...data,
          accounting_date: data.accounting_date.toString(),
          date: data.date.toString(),
          company: 1,
        },
        id: id!
      }).unwrap()

      if (response.status === "success") {
        router.push(`/purchases/bills/${id}`)
        toast.custom((t) => <CustomSonner t={t} description="Factura de compra actualizada exitosamente" />)
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar la factura de compra" variant="error" />)
      sendMessage({
        location: "app/(private)/(commercial)/purchases/bills/(form)/[id]/edit/page.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      }).unwrap().catch((error) => {
        console.error(error);
      });
    }
  }

  useEffect(() => {
    if (bill) {
      newBillForm.reset({
        supplier: bill?.supplier?.id,
        custom_sequence_number: bill?.custom_sequence_number || "",
        date: bill?.date && parseDate(bill.date),
        accounting_date: bill?.accounting_date && parseDate(bill.accounting_date),
        currency: bill?.currency?.id,
        payment_term: bill?.payment_term?.id,
        payment_method: bill?.payment_method?.id,
        internal_notes: typeof bill?.internal_notes === "string" ? bill.internal_notes : undefined,
        tyc_notes: typeof bill?.tyc_notes === "string" ? bill.tyc_notes : "",
        items: bill?.items?.map((item) => ({
          product_id: item?.product_id,
          quantity: item?.quantity,
          price_unit: item?.price_unit,
          account_id: item?.account.id,
          cost_center: item?.cost_center?.id,
          taxes_id: item?.taxes.map((tax) => tax.id),
        })) || [],
      })
    }
  }, [bill])

  return (
    <Form {...newBillForm}>
      <Header title="Editar factura de compra">
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newBillForm.handleSubmit(onSubmit)}
            size="sm"
            loading={isUpdatingBill}
          >
            <Save className={cn(isUpdatingBill && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
    </Form>
  )
}