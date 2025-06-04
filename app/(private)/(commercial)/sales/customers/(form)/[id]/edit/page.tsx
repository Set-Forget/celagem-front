"use client"

import CustomSonner from "@/components/custom-sonner"
import { FormTabs } from "@/components/form-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useGetCustomerQuery, useUpdateCustomerMutation } from "@/lib/services/customers"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calculator, Mail, Save, Wallet } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newCustomerAccountingSchema, newCustomerContactSchema, newCustomerFiscalSchema, newCustomerSchema } from "../../../schema/customers"
import AccountingForm from "../../new/components/accounting-form"
import ContactForm from "../../new/components/contact-form"
import FiscalForm from "../../new/components/fiscal-form"
import GeneralForm from "../../new/components/general-form"

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
  const { id } = useParams<{ id: string }>()

  const router = useRouter()

  const { data: customer, isLoading: isCustomerLoading } = useGetCustomerQuery(id, {
    skip: !id,
  })
  const [updateCustomer, { isLoading: isUpdatingCustomer }] = useUpdateCustomerMutation()

  const form = useForm<z.infer<typeof newCustomerSchema>>({
    resolver: zodResolver(newCustomerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      website: "",
      contact_address_inline: "",
      property_account_position: false,
      tax_id: "",
      is_resident: true,
    }
  })

  const onSubmit = async (data: z.infer<typeof newCustomerSchema>) => {
    const { contact_address_inline, commercial_company_name, ...rest } = data

    try {
      const response = await updateCustomer({
        body: {
          ...rest,
          country_id: 1,
          state_id: 1,
          city: "",
          zip: "",
          street: "",
        },
        id: id,
      }).unwrap()

      if (response.status === "success") {
        router.push(`/sales/customers/${id}`)
        toast.custom((t) => <CustomSonner t={t} description="Cliente actualizado exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar el cliente" variant="error" />)
    }
  }

  useEffect(() => {
    if (customer) {
      form.reset({
        ...customer,
        commercial_company_name: customer.commercial_company_name || "",
        property_payment_term: customer.property_payment_term?.id,
        property_account_position: customer.property_account_position || undefined,
        currency: customer.currency?.id,
        economic_activity: customer.economic_activity?.id,
        account: customer.account?.id,
        payment_method: customer.payment_method?.id,
        country_id: customer.country_id,
      })
    }
  }, [customer])

  return (
    <Form {...form}>
      <Header title="Editar cliente" >
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          size="sm"
          className="ml-auto"
          loading={isUpdatingCustomer}
        >
          <Save className={cn(isUpdatingCustomer && "hidden")} />
          Guardar
        </Button>
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
    </Form>
  )
}