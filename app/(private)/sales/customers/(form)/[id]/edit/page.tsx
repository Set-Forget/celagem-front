"use client"

import CustomSonner from "@/components/custom-sonner"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCreateCustomerMutation, useGetCustomerQuery, useUpdateCustomerMutation } from "@/lib/services/customers"
import { cn, getFieldPaths } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { get } from "lodash"
import { Calculator, Mail, Save, Wallet } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newCustomerAccountingSchema, newCustomerContactSchema, newCustomerFiscalSchema, newCustomerSchema } from "../../../schema/customers"
import ContactForm from "../../new/components/contact-form"
import FiscalForm from "../../new/components/fiscal-form"
import AccountingForm from "../../new/components/accounting-form"
import GeneralForm from "../../new/components/general-form"

const tabToFieldsMap = {
  "tab-1": getFieldPaths(newCustomerContactSchema),
  "tab-2": getFieldPaths(newCustomerFiscalSchema),
  "tab-3": getFieldPaths(newCustomerAccountingSchema),
}

const tabs = [
  {
    value: "tab-1",
    label: "Contacto",
    icon: <Mail className="mr-1.5" size={16} />,
    content: <ContactForm />
  },
  {
    value: "tab-2",
    label: "Fiscal",
    icon: <Wallet className="mr-1.5" size={16} />,
    content: <FiscalForm />
  },
  {
    value: "tab-3",
    label: "Contabilidad",
    icon: <Calculator className="mr-1.5" size={16} />,
    content: <AccountingForm />
  }
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const router = useRouter()

  const [tab, setTab] = useState(tabs[0].value)

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
      commercial_company_name: "",
      tax_id: "",
      is_resident: true,
    }
  })

  const onSubmit = async (data: z.infer<typeof newCustomerSchema>) => {
    const { contact_address_inline, ...rest } = data

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

  const onError = (errors: FieldErrors<z.infer<typeof newCustomerSchema>>) => {
    for (const [tabKey, fields] of Object.entries(tabToFieldsMap)) {
      const hasError = fields.some((fieldPath) => {
        return get(errors, fieldPath) != null;
      });
      if (hasError) {
        setTab(tabKey);
        break;
      }
    }
  };

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
          onClick={form.handleSubmit(onSubmit, onError)}
          size="sm"
          className="ml-auto"
          loading={isUpdatingCustomer}
        >
          <Save className={cn(isUpdatingCustomer && "hidden")} />
          Guardar
        </Button>
      </Header>
      <GeneralForm />
      <DataTabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        triggerClassName="mt-4"
        // ? data-[state=inactive]:hidden se usa para ocultar el contenido de las tabs que no estén activas, esto es necesario porque forceMount hace que el contenido de todas las tabs se monte al mismo tiempo.
        contentClassName="data-[state=inactive]:hidden"
        // ? forceMount se usa para que el contenido de las tabs no se desmonte al cambiar de tab, esto es necesario para que los errores de validación no se pierdan al cambiar de tab.
        forceMount
      />
    </Form>
  )
}