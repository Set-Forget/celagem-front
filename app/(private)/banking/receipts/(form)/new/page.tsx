"use client"

import Header from "@/components/header"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newChargeSchema } from "../../schemas/receipts"
import GeneralForm from "../components/general-form"
import Actions from "./actions"
import { defaultValues } from "../default-values"

export default function Page() {
  const form = useForm<z.infer<typeof newChargeSchema>>({
    resolver: zodResolver(newChargeSchema),
    defaultValues: defaultValues,
  })

  return (
    <Form {...form}>
      <Header title="Registrar cobro">
        <Actions />
      </Header>
      <GeneralForm />
    </Form>
  )
}