"use client"

import CustomSonner from "@/components/custom-sonner"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useGetProfileQuery } from "@/lib/services/auth"
import { useCreatePatientMutation, useGetPatientQuery, useUpdatePatientMutation } from "@/lib/services/patients"
import { zodResolver } from "@hookform/resolvers/zod"
import { get } from "lodash"
import { Building, House, Shield, Users, Wallet } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newPatientCareCompanySchema, newPatientCaregiverSchema, newPatientCompanionSchema, newPatientFiscalSchema, newPatientGeneralSchema, newPatientSchema } from "../../../schema/patients"
import CareCompanyForm from "../../components/care_company-form"
import CaregiverForm from "../../components/caregiver-form"
import CompanionForm from "../../components/companion-form"
import FiscalForm from "../../components/fiscal-form"
import GeneralForm from "../../components/general-form"
import { getFieldPaths } from "../../utils"

// ! Se puede unificar con el tabs de abajo.
const tabToFieldsMap = {
  "tab-1": getFieldPaths(newPatientGeneralSchema),
  "tab-2": getFieldPaths(newPatientCompanionSchema),
  "tab-3": getFieldPaths(newPatientCaregiverSchema),
  "tab-4": getFieldPaths(newPatientCareCompanySchema),
  "tab-5": getFieldPaths(newPatientFiscalSchema),
}

const tabs = [
  {
    value: "tab-1",
    label: "General",
    icon: <House className="mr-1.5" size={16} />,
    content: <GeneralForm />
  },
  {
    value: "tab-2",
    label: "Acompañante",
    icon: <Users className="mr-1.5" size={16} />,
    content: <CompanionForm />
  },
  {
    value: "tab-3",
    label: "Responsable",
    icon: <Shield className="mr-1.5" size={16} />,
    content: <CaregiverForm />
  },
  {
    value: "tab-4",
    label: "Empresa responsable",
    icon: <Building className="mr-1.5" size={16} />,
    content: <CareCompanyForm />
  },
  {
    value: "tab-5",
    label: "Fiscal",
    icon: <Wallet className="mr-1.5" size={16} />,
    content: <FiscalForm />
  },
];

export default function Page() {
  const router = useRouter()
  const params = useParams<{ patient_id: string }>();

  const patientId = params.patient_id;

  const [updatePatient, { isLoading: isUpdatingPatient }] = useUpdatePatientMutation()

  const { data: patient } = useGetPatientQuery(patientId, { skip: !patientId })

  const form = useForm<z.infer<typeof newPatientSchema>>({
    resolver: zodResolver(newPatientSchema),
  })

  const [tab, setTab] = useState("tab-1")

  const onSubmit = async (data: z.infer<typeof newPatientSchema>) => {
    try {
      const response = await updatePatient({
        id: patientId,
        body: data
      }).unwrap()

      if (response.status === "SUCCESS") {
        router.push(`/medical-management/patients/${patientId}`)
        toast.custom((t) => <CustomSonner t={t} description="Paciente actualizado exitosamente" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al actualizar el paciente" variant="error" />)
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
    if (patient) {
      form.reset({
        ...patient,
        class_id: patient.class?.id,
        birthdate: patient.birth_date,
        linkage: patient.linkage || undefined,
        created_by: patient.created_by?.id,
      })
    }
  }, [patient])

  return (
    <Form {...form}>
      <Header title="Actualizar paciente">
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit, onError)}
          size="sm"
          className="ml-auto"
          loading={isUpdatingPatient}
        >
          Actualizar paciente
        </Button>
      </Header>
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