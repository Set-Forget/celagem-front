import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLazyGetAppointmentQuery } from "@/lib/services/appointments";
import { useGetProfileQuery } from "@/lib/services/auth";
import { useLazyGetPatientQuery } from "@/lib/services/patients";
import { useGetVisitQuery, useUpdateVisitMutation } from "@/lib/services/visits";
import { cn } from "@/lib/utils";
import { generatePDF } from "@/lib/templates/utils";
import { EditIcon, Ellipsis, FileDown, FileTextIcon, Loader2, Signature } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useSendMessageMutation } from "@/lib/services/telegram";

export default function Actions({ state }: { state?: 'DRAFT' | 'SIGNED' }) {
  const router = useRouter()
  const params = useParams<{ visit_id: string }>();

  const visitId = params.visit_id

  const [loading, setLoading] = useState(false)

  const [sendMessage] = useSendMessageMutation()
  const [updateVisit, { isLoading: isUpdatingVisit }] = useUpdateVisitMutation();
  const [getAppointment] = useLazyGetAppointmentQuery()
  const [getPatient] = useLazyGetPatientQuery()

  const { data: visit } = useGetVisitQuery(visitId)
  const { data: userProfile } = useGetProfileQuery()

  const handleSignVisit = async () => {
    if (visit?.doctor.id !== userProfile?.data.id) {
      return toast.custom((t) => <CustomSonner t={t} description="No tienes permisos para firmar esta visita" variant="error" />)
    }

    try {
      const response = await updateVisit({
        id: visitId,
        body: {
          medical_record: {
            is_signed: true
          }
        }
      }).unwrap()

      if (response.status === "SUCCESS") {
        toast.custom((t) => <CustomSonner t={t} description="Visita firmada exitosamente" />)
      }
    } catch (error) {
      sendMessage({
        location: "app/(private)/medical-management/visits/(form)/[visit_id]/actions.tsx",
        rawError: error,
        fnLocation: "handleSignVisit"
      })
    }
  }

  const handleGeneratePDF = async () => {
    setLoading(true)
    try {
      const appointment = await getAppointment(visit?.appointment_id!).unwrap()
      const patient = await getPatient(appointment.patient.id!).unwrap()

      const pdf = await generatePDF({
        templateName: 'visitRecord',
        data: {
          visit: visit!,
          appointment: appointment!,
          patient: patient,
          data: visit?.medical_record || "{}"
        },
      });
      pdf.view();
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al generar el PDF" variant="error" />)
      sendMessage({
        location: "app/(private)/medical-management/visits/(form)/[visit_id]/actions.tsx",
        rawError: error,
        fnLocation: "handleGeneratePDF"
      })
    } finally {
      setLoading(false)
    }
  };

  if (!state) {
    return null
  }

  if (state === "DRAFT") {
    return (
      <div className="flex gap-2">
        <Dropdown
          trigger={
            <Button size="icon" variant="outline" className="h-8 w-8">
              <Ellipsis />
            </Button>
          }
        >
          <DropdownMenuItem
            disabled={loading}
            onSelect={handleGeneratePDF}
          >
            {loading ? <Loader2 className="animate-spin" /> : <FileTextIcon />}
            Previsualizar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push(`/medical-management/visits/${visitId}/edit`)}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={handleSignVisit}
          loading={isUpdatingVisit}
        >
          <Signature className={cn(isUpdatingVisit && "hidden")} />
          Firmar visita
        </Button>
      </div>
    )
  }

  if (state === "SIGNED") {
    return (
      <Button
        size="sm"
        onClick={handleGeneratePDF}
        loading={loading}
      >
        <FileDown className={cn(loading && "hidden")} />
        Exportar
      </Button>
    )
  }
}