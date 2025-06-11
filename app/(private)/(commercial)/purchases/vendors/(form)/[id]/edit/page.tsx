"use client"

import CustomSonner from "@/components/custom-sonner"
import { FormTabs } from "@/components/form-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useGetSupplierQuery, useUpdateSupplierMutation } from "@/lib/services/suppliers"
import { useSendMessageMutation } from "@/lib/services/telegram"
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

  const [sendMessage] = useSendMessageMutation();
  const [updateSupplier, { isLoading: isUpdatingSupplier }] = useUpdateSupplierMutation()

  const { data: supplier } = useGetSupplierQuery(id, {
    skip: !id,
  })

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
          except_withholding_source: data?.withholding_sources?.length === 0,
        },
        id,
      }).unwrap()

      if (response.status === "success") {
        router.push(`/purchases/vendors/${id}`)
        toast.custom((t) => <CustomSonner t={t} description="Proveedor actualizado exitosamente" variant="success" />)
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar el proveedor" variant="error" />)
      sendMessage({
        location: "app/(private)/(commercial)/purchases/vendors/(form)/[id]/edit/page.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      }).unwrap().catch((error) => {
        console.error(error);
      });
    }
  }

  useEffect(() => {
    if (!supplier) return
    form.reset({
      ...supplier,
      legal_name: supplier.legal_name || undefined,
      property_payment_term: supplier.property_payment_term?.id,
      property_account_position: supplier.property_account_position || undefined,
      currency: supplier.currency?.id,
      economic_activity: supplier.economic_activity?.id,
      phone: supplier.phone || undefined,
      account: supplier.account?.id,
      website: supplier.website || undefined,
      payment_method: supplier.payment_method?.id,
      country_id: supplier.country_id,
      withholding_sources: supplier.withholding_source_ids.map((source) => source.id),
      email: supplier.email || undefined,
      tax_id: supplier.tax_id || undefined,
      tax_type: supplier.tax_type || undefined,
      entity_type: supplier.entity_type || undefined,
      nationality_type: supplier.nationality_type || undefined,
      tax_regime: supplier.tax_regime || undefined,
      tax_category: supplier.tax_category || undefined,
      is_resident: supplier.is_resident || false,
      tax_information: supplier.tax_information || undefined,
      fiscal_responsibility: supplier.fiscal_responsibility || undefined,
    })
  }, [supplier])

  return (
    <Form {...form}>
      <Header title={`Editar proveedor ${supplier?.name}`}>
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