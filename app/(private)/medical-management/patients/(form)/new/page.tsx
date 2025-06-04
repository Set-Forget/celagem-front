"use client"

import CustomSonner from "@/components/custom-sonner"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useGetProfileQuery } from "@/lib/services/auth"
import { useCreatePatientMutation } from "@/lib/services/patients"
import { zodResolver } from "@hookform/resolvers/zod"
import { get } from "lodash"
import { Building, Hospital, House, Mail, Shield, Users, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newPatientAffiliationSchema, newPatientCareCompanySchema, newPatientCaregiverSchema, newPatientCompanionSchema, newPatientContactSchema, newPatientFiscalSchema, newPatientGeneralSchema, newPatientSchema } from "../../schema/patients"
import { getFieldPaths } from "@/lib/utils"
import GeneralForm from "../components/general-form"
import CompanionForm from "../components/companion-form"
import CaregiverForm from "../components/caregiver-form"
import CareCompanyForm from "../components/care_company-form"
import FiscalForm from "../components/fiscal-form"
import ContactForm from "../components/contact-form"
import AffiliationForm from "../components/affiliation-form"
import { FormTabs } from "@/components/form-tabs"

const tabs = [
  {
    value: "tab-1",
    label: "Contacto",
    icon: <Mail size={16} />,
    content: <ContactForm />,
    schema: newPatientContactSchema,
  },
  {
    value: "tab-2",
    label: "Afiliación",
    icon: <Hospital size={16} />,
    content: <AffiliationForm />,
    schema: newPatientAffiliationSchema,
  },
  {
    value: "tab-3",
    label: "Acompañante",
    icon: <Users size={16} />,
    content: <CompanionForm />,
    schema: newPatientCompanionSchema,
  },
  {
    value: "tab-4",
    label: "Responsable",
    icon: <Shield size={16} />,
    content: <CaregiverForm />,
    schema: newPatientCaregiverSchema,
  },
  {
    value: "tab-5",
    label: "Empresa responsable",
    icon: <Building size={16} />,
    content: <CareCompanyForm />,
    schema: newPatientCareCompanySchema,
  },
  {
    value: "tab-6",
    label: "Fiscal",
    icon: <Wallet size={16} />,
    content: <FiscalForm />,
    schema: newPatientFiscalSchema,
  },
];

export default function Page() {
  const router = useRouter()

  const [createPatient, { isLoading: isCreatingPatient }] = useCreatePatientMutation()
  const { data: profile } = useGetProfileQuery()

  const newPatientForm = useForm<z.infer<typeof newPatientSchema>>({
    resolver: zodResolver(newPatientSchema),
  })

  const onSubmit = async (data: z.infer<typeof newPatientSchema>) => {
    try {
      const response = await createPatient({
        ...data,
        birthdate: data.birthdate.toString(),
      }).unwrap()

      if (response.status === "SUCCESS") {
        router.push(`/medical-management/patients/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Paciente creado exitosamente" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al crear paciente" variant="error" />)
    }
  }

  useEffect(() => {
    if (profile) {
      newPatientForm.setValue("created_by", profile.data.id)
    }
  }, [profile])

  return (
    <Form {...newPatientForm}>
      <Header title="Nuevo paciente">
        <Button
          type="submit"
          onClick={newPatientForm.handleSubmit(onSubmit)}
          size="sm"
          className="ml-auto"
          loading={isCreatingPatient}
        >
          Crear paciente
        </Button>
      </Header>
      <GeneralForm />
      <FormTabs tabs={tabs} />
    </Form>
  )
}