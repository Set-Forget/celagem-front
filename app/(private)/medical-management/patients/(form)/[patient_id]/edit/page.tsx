"use client"

import CustomSonner from "@/components/custom-sonner"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useGetProfileQuery } from "@/lib/services/auth"
import { useGetPatientQuery, useUpdatePatientMutation } from "@/lib/services/patients"
import { cn, getFieldPaths } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarDate } from "@internationalized/date"
import { get } from "lodash"
import { Building, Hospital, Mail, Save, Shield, Users, Wallet } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newPatientAffiliationSchema, newPatientCareCompanySchema, newPatientCaregiverSchema, newPatientCompanionSchema, newPatientContactSchema, newPatientFiscalSchema, newPatientSchema } from "../../../schema/patients"
import AffiliationForm from "../../components/affiliation-form"
import CareCompanyForm from "../../components/care_company-form"
import CaregiverForm from "../../components/caregiver-form"
import CompanionForm from "../../components/companion-form"
import ContactForm from "../../components/contact-form"
import FiscalForm from "../../components/fiscal-form"
import GeneralForm from "../../components/general-form"

// ! Se puede unificar con el tabs de abajo.
const tabToFieldsMap = {
  "tab-1": getFieldPaths(newPatientContactSchema),
  "tab-2": getFieldPaths(newPatientAffiliationSchema),
  "tab-3": getFieldPaths(newPatientCompanionSchema),
  "tab-4": getFieldPaths(newPatientCaregiverSchema),
  "tab-5": getFieldPaths(newPatientCareCompanySchema),
  "tab-6": getFieldPaths(newPatientFiscalSchema),
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
    label: "Afiliación",
    icon: <Hospital className="mr-1.5" size={16} />,
    content: <AffiliationForm />
  },
  {
    value: "tab-3",
    label: "Acompañante",
    icon: <Users className="mr-1.5" size={16} />,
    content: <CompanionForm />
  },
  {
    value: "tab-4",
    label: "Responsable",
    icon: <Shield className="mr-1.5" size={16} />,
    content: <CaregiverForm />
  },
  {
    value: "tab-5",
    label: "Empresa responsable",
    icon: <Building className="mr-1.5" size={16} />,
    content: <CareCompanyForm />
  },
  {
    value: "tab-6",
    label: "Fiscal",
    icon: <Wallet className="mr-1.5" size={16} />,
    content: <FiscalForm />
  },
];

export default function Page() {
  const params = useParams<{ patient_id: string }>();
  const router = useRouter()

  const patientId = params.patient_id;

  const [updatePatient, { isLoading: isUpdatingPatient }] = useUpdatePatientMutation()

  const { data: profile } = useGetProfileQuery()
  const { data: patient } = useGetPatientQuery(patientId, { skip: !patientId })

  const newPatientForm = useForm<z.infer<typeof newPatientSchema>>({
    resolver: zodResolver(newPatientSchema),
  })

  const [tab, setTab] = useState(tabs[0].value)

  const onSubmit = async (data: z.infer<typeof newPatientSchema>) => {
    const { created_by, birthdate, ...rest } = data
    try {
      const response = await updatePatient({
        id: patientId,
        body: {
          ...rest,
          birth_date: data.birthdate.toString(),
        },
      }).unwrap()

      if (response.status === "SUCCESS") {
        router.push(`/medical-management/patients/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Paciente actualizado exitosamente" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al actualizar paciente" variant="error" />)
    }
  }

  const onError = (errors: FieldErrors<z.infer<typeof newPatientSchema>>) => {
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
    if (profile) {
      newPatientForm.setValue("created_by", profile.data.id)
    }
  }, [profile])

  useEffect(() => {
    if (patient) {
      const [year, month, day] = patient.birth_date.split('T')[0].split('-').map(Number);
      newPatientForm.reset({
        ...patient,
        clinics: patient.clinics.map((clinic) => clinic.id),
        company_id: patient.company.id,
        class_id: patient.class.id,
        created_by: patient.created_by.id,
        address: patient.address ?? undefined,
        birthdate: new CalendarDate(year, month - 1, day),
        caregiver: {
          ...patient.caregiver,
          address: !!patient.caregiver.address.place_id ? patient.caregiver.address : undefined,
        },
        companion: {
          ...patient.companion,
          address: !!patient.companion.address.place_id ? patient.companion.address : undefined,
        },
        disability_type: patient.disability_type ?? undefined,
        care_company_plan: {
          care_company_id: patient.care_company_plan.care_company.id,
          contract_number: patient.care_company_plan.contract_number,
          coverage: patient.care_company_plan.coverage,
        },
        insurance_provider: patient.insurance_provider ?? undefined,
        referring_entity: patient.referring_entity ?? undefined,
      })
    }
  }, [patient])

  return (
    <Form {...newPatientForm}>
      <Header title="Editar paciente">
        <Button
          type="submit"
          onClick={newPatientForm.handleSubmit(onSubmit, onError)}
          size="sm"
          className="ml-auto"
          loading={isUpdatingPatient}
        >
          <Save className={cn(isUpdatingPatient && "hidden")} />
          Guardar
        </Button>
      </Header>
      <GeneralForm />
      <DataTabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        // ? data-[state=inactive]:hidden se usa para ocultar el contenido de las tabs que no estén activas, esto es necesario porque forceMount hace que el contenido de todas las tabs se monte al mismo tiempo.
        contentClassName="data-[state=inactive]:hidden"
        // ? forceMount se usa para que el contenido de las tabs no se desmonte al cambiar de tab, esto es necesario para que los errores de validación no se pierdan al cambiar de tab.
        forceMount
      />
    </Form>
  )
}