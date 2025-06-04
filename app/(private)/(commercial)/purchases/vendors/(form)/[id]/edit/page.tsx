"use client"

import CustomSonner from "@/components/custom-sonner"
import { FormTabs } from "@/components/form-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useGetSupplierQuery, useUpdateSupplierMutation } from "@/lib/services/suppliers"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calculator, Mail, Save, Wallet } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newSupplierAccountingSchema, newSupplierContactSchema, newSupplierFiscalSchema, newSupplierSchema } from "../../../schema/suppliers"
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
    schema: newSupplierContactSchema,
  },
  {
    value: "tab-2",
    label: "Fiscal",
    icon: <Wallet size={16} />,
    content: <FiscalForm />,
    schema: newSupplierFiscalSchema,
  },
  {
    value: "tab-3",
    label: "Contabilidad",
    icon: <Calculator size={16} />,
    content: <AccountingForm />,
    schema: newSupplierAccountingSchema,
  }
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const router = useRouter()

  const { data: supplier } = useGetSupplierQuery(id, {
    skip: !id,
  })
  const [updateSupplier, { isLoading: isUpdatingSupplier }] = useUpdateSupplierMutation()

  const form = useForm<z.infer<typeof newSupplierSchema>>({
    resolver: zodResolver(newSupplierSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      website: "",
      contact_address_inline: "",
      property_account_position: false,
      legal_name: "",
      tax_id: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof newSupplierSchema>) => {
    const { contact_address_inline, ...rest } = data
    try {
      const response = await updateSupplier({
        body: {
          ...rest,
          country_id: 1,
          state_id: 1,
          city: "",
          zip: "",
          street: "",
        },
        id,
      }).unwrap()

      if (response.status === "success") {
        router.push(`/purchases/vendors/${id}`)
        toast.custom((t) => <CustomSonner t={t} description="Proveedor actualizado exitosamente" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar el proveedor" variant="error" />)
    }
  }


  useEffect(() => {
    if (supplier) {
      form.reset({
        ...supplier,
        legal_name: supplier.legal_name || "",
        property_payment_term: supplier.property_payment_term?.id,
        property_account_position: supplier.property_account_position || undefined,
        currency: supplier.currency?.id,
        economic_activity: supplier.economic_activity?.id,
        account: supplier.account?.id,
        payment_method: supplier.payment_method?.id,
        country_id: supplier.country_id,
      })
    }
  }, [supplier])

  return (
    <Form {...form}>
      <Header title="Editar proveedor" >
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          size="sm"
          className="ml-auto"
          loading={isUpdatingSupplier}
        >
          <Save className={cn(isUpdatingSupplier && "hidden")} />
          Guardar
        </Button>
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
    </Form>
  )
}