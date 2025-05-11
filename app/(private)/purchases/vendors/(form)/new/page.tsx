"use client"

import CustomSonner from "@/components/custom-sonner"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useCreateSupplierMutation } from "@/lib/services/suppliers"
import { getFieldPaths } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { get } from "lodash"
import { Calculator, Ellipsis, Mail, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newSupplierAccountingSchema, newSupplierContactSchema, newSupplierFiscalSchema, newSupplierSchema } from "../../schema/suppliers"
import AccountingForm from "./components/accounting-form"
import ContactForm from "./components/contact-form"
import FiscalForm from "./components/fiscal-form"
import GeneralForm from "./components/general-form"

const tabToFieldsMap = {
  "tab-1": getFieldPaths(newSupplierContactSchema),
  "tab-2": getFieldPaths(newSupplierFiscalSchema),
  "tab-3": getFieldPaths(newSupplierAccountingSchema),
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
  const router = useRouter()

  const [createSupplier, { isLoading: isCreatingSupplier }] = useCreateSupplierMutation()

  const [tab, setTab] = useState(tabs[0].value)

  const newSupplierForm = useForm<z.infer<typeof newSupplierSchema>>({
    resolver: zodResolver(newSupplierSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      website: "",
      contact_address_inline: "",
      property_account_position: false,
      commercial_company_name: "",
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

  const onError = (errors: FieldErrors<z.infer<typeof newSupplierSchema>>) => {
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

  return (
    <Form {...newSupplierForm}>
      <Header title="Nuevo proveedor" >
        <Button
          type="submit"
          onClick={newSupplierForm.handleSubmit(onSubmit, onError)}
          size="sm"
          className="ml-auto"
          loading={isCreatingSupplier}
        >
          Crear proveedor
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