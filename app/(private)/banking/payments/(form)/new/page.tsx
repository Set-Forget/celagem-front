"use client"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newPaymentSchema } from "../../schemas/payments"
import GeneralForm from "./components/general-form"
import { useCreatePaymentMutation } from "@/lib/services/payments"
import CustomSonner from "@/components/custom-sonner"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { routes } from "@/lib/routes"

export default function Page() {
  const router = useRouter()

  const [createPayment, { isLoading: isCreatingPayment }] = useCreatePaymentMutation()

  const form = useForm<z.infer<typeof newPaymentSchema>>({
    resolver: zodResolver(newPaymentSchema),
  })

  const onSubmit = async (data: z.infer<typeof newPaymentSchema>) => {
    const { bills, ...rest } = data

    try {
      const response = await createPayment({
        ...rest,
        date: rest.date.toString(),
        amount: rest.amount || bills?.reduce((acc, b) => acc + b.amount_residual, 0),
        partner: rest.partner || bills?.[0]?.supplier.id,
        journal: 6,
        invoices: bills?.map((b) => b.id) || undefined,
      }).unwrap()

      if (response.status === "success") {
        router.push(routes.payments.detail(response.data.id))
        toast.custom((t) => <CustomSonner t={t} description="Pago registrado exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al registrar el pago" variant="error" />)
    }
  }

  return (
    <Form {...form}>
      <Header title="Registrar pago">
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            size="sm"
            loading={isCreatingPayment}
          >
            <Save className={cn(isCreatingPayment && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <GeneralForm />
    </Form>
  )
}