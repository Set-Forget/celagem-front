"use client"

import Header from "@/components/header"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newPaymentSchema } from "../../schemas/payments"
import GeneralForm from "../components/general-form"
import { defaultValues } from "../default-values"
import Actions from "./actions"

export default function Page() {
  const form = useForm<z.infer<typeof newPaymentSchema>>({
    resolver: zodResolver(newPaymentSchema),
    defaultValues: defaultValues
  })
  return (
    <Form {...form}>
      <Header title="Registrar pago">
        <Actions />
      </Header>
      <GeneralForm />
    </Form>
  )
}