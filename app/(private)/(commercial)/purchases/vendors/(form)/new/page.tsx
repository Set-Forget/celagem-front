"use client"

import CustomSonner from "@/components/custom-sonner"
import { FormTabs } from "@/components/form-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useCreateSupplierMutation } from "@/lib/services/suppliers"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calculator, Mail, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newSupplierAccountingSchema, newSupplierContactSchema, newSupplierFiscalSchema, newSupplierSchema } from "../../schema/suppliers"
import AccountingForm from "./components/accounting-form"
import ContactForm from "./components/contact-form"
import FiscalForm from "./components/fiscal-form"
import GeneralForm from "./components/general-form"

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
  const router = useRouter()

  const [createSupplier, { isLoading: isCreatingSupplier }] = useCreateSupplierMutation()

  const newSupplierForm = useForm<z.infer<typeof newSupplierSchema>>({
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
      const response = await createSupplier({
        ...rest,
        country_id: 1,
        state_id: 1,
        city: "",
        zip: "",
        street: "",
      }).unwrap()

      if (response.status === "success") {
        router.push(`/purchases/vendors/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Proveedor creado exitosamente" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear el proveedor" variant="error" />)
    }
  }

  return (
    <Form {...newSupplierForm}>
      <Header title="Nuevo proveedor" >
        <Button
          type="submit"
          onClick={newSupplierForm.handleSubmit(onSubmit)}
          size="sm"
          className="ml-auto"
          loading={isCreatingSupplier}
        >
          Crear proveedor
        </Button>
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
    </Form>
  )
}