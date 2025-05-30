"use client"

import CustomSonner from "@/components/custom-sonner"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCreateCustomerMutation } from "@/lib/services/customers"
import { cn, getFieldPaths } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { get } from "lodash"
import { Calculator, Mail, Save, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newCustomerAccountingSchema, newCustomerContactSchema, newCustomerFiscalSchema, newCustomerSchema } from "../../schema/customers"
import ContactForm from "./components/contact-form"
import GeneralForm from "./components/general-form"
import FiscalForm from "./components/fiscal-form"
import AccountingForm from "./components/accounting-form"
import { FormTabs } from "@/components/form-tabs"

const tabs = [
  {
    value: "tab-1",
    label: "Contacto",
    icon: <Mail className="mr-1.5" size={16} />,
    content: <ContactForm />,
    schema: newCustomerContactSchema,
  },
  {
    value: "tab-2",
    label: "Fiscal",
    icon: <Wallet className="mr-1.5" size={16} />,
    content: <FiscalForm />,
    schema: newCustomerFiscalSchema,
  },
  {
    value: "tab-3",
    label: "Contabilidad",
    icon: <Calculator className="mr-1.5" size={16} />,
    content: <AccountingForm />,
    schema: newCustomerAccountingSchema,
  }
]

export default function Page() {
  const router = useRouter()

  const [createCustomer, { isLoading: isCreatingCustomer }] = useCreateCustomerMutation()

  const newCustomerForm = useForm<z.infer<typeof newCustomerSchema>>({
    resolver: zodResolver(newCustomerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      website: "",
      contact_address_inline: "",
      property_account_position: false,
      legal_name: "",
      tax_id: "",
      is_resident: true,
    }
  })

  const onSubmit = async (data: z.infer<typeof newCustomerSchema>) => {
    const { contact_address_inline, commercial_company_name, ...rest } = data

    try {
      const response = await createCustomer({
        ...rest,
        country_id: 1,
        state_id: 1,
        city: "",
        zip: "",
        street: "",
        legal_name: rest.name,
      }).unwrap()

      if (response.status === "success") {
        router.push(`/sales/customers/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Cliente creado exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear el cliente" variant="error" />)
    }
  }

  return (
    <Form {...newCustomerForm}>
      <Header title="Nuevo cliente" >
        <Button
          type="submit"
          onClick={newCustomerForm.handleSubmit(onSubmit)}
          size="sm"
          className="ml-auto"
          loading={isCreatingCustomer}
        >
          <Save className={cn(isCreatingCustomer && "hidden")} />
          Guardar
        </Button>
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
    </Form>
  )
}