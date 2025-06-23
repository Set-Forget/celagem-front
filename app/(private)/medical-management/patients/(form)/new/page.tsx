"use client"

import CustomSonner from "@/components/custom-sonner"
import { FormTabs } from "@/components/form-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useCreatePatientMutation } from "@/lib/services/patients"
import { useSendMessageMutation } from "@/lib/services/telegram"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building, Hospital, Mail, Shield, Users, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newPatientAffiliationSchema, newPatientCareCompanySchema, newPatientCaregiverSchema, newPatientCompanionSchema, newPatientContactSchema, newPatientFiscalSchema, newPatientSchema } from "../../schema/patients"
import AffiliationForm from "../components/affiliation-form"
import CareCompanyForm from "../components/care_company-form"
import CaregiverForm from "../components/caregiver-form"
import CompanionForm from "../components/companion-form"
import ContactForm from "../components/contact-form"
import FiscalForm from "../components/fiscal-form"
import GeneralForm from "../components/general-form"

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

  const [sendMessage] = useSendMessageMutation()
  const [createPatient, { isLoading: isCreatingPatient }] = useCreatePatientMutation()

  const newPatientForm = useForm<z.infer<typeof newPatientSchema>>({
    resolver: zodResolver(newPatientSchema),
  })

  const onSubmit = async (data: z.infer<typeof newPatientSchema>) => {
    try {
      const response = await createPatient({
        ...data,
        birthdate: data.birthdate.toString(),
        fiscal: {
          ...data.fiscal,
          registered_name: data.fiscal.registered_name || data.first_name + " " + data.first_last_name,
        },
        created_by: undefined,
      }).unwrap()

      if (response.status === "SUCCESS") {
        router.push(`/medical-management/patients/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Paciente creado exitosamente" variant="success" />)
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al crear paciente" variant="error" />)
      sendMessage({
        location: "app/(private)/medical-management/patients/(form)/new/page.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      })
    }
  }

  return (
    <div>
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
    </div>
  )
}