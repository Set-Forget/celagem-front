"use client"

import CustomSonner from "@/components/custom-sonner"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useCreateSupplierMutation, useGetSupplierQuery, useUpdateSupplierMutation } from "@/lib/services/suppliers"
import { cn, getFieldPaths } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { get } from "lodash"
import { Calculator, Mail, Save, Wallet } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newSupplierAccountingSchema, newSupplierContactSchema, newSupplierFiscalSchema, newSupplierSchema } from "../../../schema/suppliers"
import ContactForm from "../../new/components/contact-form"
import FiscalForm from "../../new/components/fiscal-form"
import AccountingForm from "../../new/components/accounting-form"
import GeneralForm from "../../new/components/general-form"

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
  const { id } = useParams<{ id: string }>()

  const router = useRouter()

  const { data: supplier, isLoading: isSupplierLoading } = useGetSupplierQuery(id, {
    skip: !id,
  })
  const [updateSupplier, { isLoading: isUpdatingSupplier }] = useUpdateSupplierMutation()

  const [tab, setTab] = useState(tabs[0].value)

  const form = useForm<z.infer<typeof newSupplierSchema>>({
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

  useEffect(() => {
    if (supplier) {
      form.reset({
        ...supplier,
        commercial_company_name: supplier.commercial_company_name || "",
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
          onClick={form.handleSubmit(onSubmit, onError)}
          size="sm"
          className="ml-auto"
          loading={isUpdatingSupplier}
        >
          <Save className={cn(isUpdatingSupplier && "hidden")} />
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