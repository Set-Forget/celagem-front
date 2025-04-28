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

export default function Page() {
  const newPaymentForm = useForm<z.infer<typeof newPaymentSchema>>({
    resolver: zodResolver(newPaymentSchema),
  })

  const onSubmit = (data: z.infer<typeof newPaymentSchema>) => {
    console.log(data)
  }

  console.log(newPaymentForm.watch())

  return (
    <Form {...newPaymentForm}>
      <Header title="Registrar pago">
        <div className="flex gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newPaymentForm.handleSubmit(onSubmit)}
            size="sm"
          //loading={isCreatingPurchaseRequest}
          >
            <Save className={cn(false && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <GeneralForm />
    </Form>
  )
}