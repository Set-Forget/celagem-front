"use client"

import CustomSonner from "@/components/custom-sonner"
import { FormTabs } from "@/components/form-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useCreateCustomerMutation } from "@/lib/services/customers"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calculator, Mail, Save, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newCustomerAccountingSchema, newCustomerContactSchema, newCustomerFiscalSchema, newCustomerSchema } from "../../schema/customers"
import AccountingForm from "./components/accounting-form"
import ContactForm from "./components/contact-form"
import FiscalForm from "./components/fiscal-form"
import GeneralForm from "./components/general-form"
import { useSendMessageMutation } from "@/lib/services/telegram"

const tabs = [
  {
    value: "tab-1",
    label: "Contacto",
    icon: <Mail size={16} />,
    content: <ContactForm />,
    schema: newCustomerContactSchema,
  },
  {
    value: "tab-2",
    label: "Fiscal",
    icon: <Wallet size={16} />,
    content: <FiscalForm />,
    schema: newCustomerFiscalSchema,
  },
  {
    value: "tab-3",
    label: "Contabilidad",
    icon: <Calculator size={16} />,
    content: <AccountingForm />,
    schema: newCustomerAccountingSchema,
  }
]

export default function Page() {
  const router = useRouter()

  const [createCustomer, { isLoading: isCreatingCustomer }] = useCreateCustomerMutation()
  const [sendMessage] = useSendMessageMutation()

  const newCustomerForm = useForm<z.infer<typeof newCustomerSchema>>({
    resolver: zodResolver(newCustomerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      contact_address_inline: "",
      property_account_position: false,
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
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear el cliente" variant="error" />)
      sendMessage({
        location: "app/(private)/(commercial)/sales/customers/(form)/new/page.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      }).unwrap().catch((error) => {
        console.error(error);
      });
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