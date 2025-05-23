"use client"

import CustomSonner from "@/components/custom-sonner"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { routes } from "@/lib/routes"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import GeneralForm from "./components/general-form"
import { newChargeSchema } from "../../schemas/receipts"
import { useCreateChargeMutation } from "@/lib/services/receipts"

export default function Page() {
  const router = useRouter()

  const [createCharge, { isLoading: isCreatingCharge }] = useCreateChargeMutation()

  const form = useForm<z.infer<typeof newChargeSchema>>({
    resolver: zodResolver(newChargeSchema),
  })

  const onSubmit = async (data: z.infer<typeof newChargeSchema>) => {
    const { bills, ...rest } = data

    try {
      const response = await createCharge({
        ...rest,
        date: rest.date.toString(),
        amount: rest.amount || bills?.reduce((acc, b) => acc + b.amount_residual, 0),
        partner: rest.partner || bills?.[0]?.customer.id,
        journal: 6,
        invoices: bills?.map((b) => b.id) || undefined,
      }).unwrap()

      if (response.status === "success") {
        router.push(routes.receipts.detail(response.data.id))
        toast.custom((t) => <CustomSonner t={t} description="Cobro registrado exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al registrar el cobro" variant="error" />)
    }
  }

  return (
    <Form {...form}>
      <Header title="Registrar cobro">
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            size="sm"
            loading={isCreatingCharge}
          >
            <Save className={cn(isCreatingCharge && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <GeneralForm />
    </Form>
  )
}