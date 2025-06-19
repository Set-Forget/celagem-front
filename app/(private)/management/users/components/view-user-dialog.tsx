import RenderFields from "@/components/render-fields"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGetUserQuery } from "@/lib/services/users"
import { closeDialogs, DialogsState, dialogsStateObservable, setDialogsState } from "@/lib/store/dialogs-store"
import { FieldDefinition } from "@/lib/utils"
import { SquarePen } from "lucide-react"
import { useEffect, useState } from "react"
import { UserDetail } from "../schema/users"
import { useGetDoctorQuery } from "@/lib/services/doctors"
import Image from "next/image"

const fields: FieldDefinition<UserDetail & { speciality_name?: string, signature?: string }>[] = [
  {
    label: "Nombre",
    placeholderLength: 14,
    render: (p) => p?.first_name || "No especificado",
  },
  {
    label: "Apellido",
    placeholderLength: 14,
    render: (p) => p?.last_name || "No especificado",
  },
  {
    label: "Correo electrónico",
    placeholderLength: 10,
    render: (p) => p?.email || "No especificado",
  },
  {
    label: "Rol",
    placeholderLength: 14,
    render: (p) => p?.role_name || "No especificado",
  },
  {
    label: "Compañía",
    placeholderLength: 14,
    render: (p) => p?.company_name || "No especificado",
  },
  {
    label: "Unidades de negocio",
    placeholderLength: 10,
    render: (p) => p?.business_units.map((bu) => bu.name).join(", ") || "No especificado",
  },
  {
    label: "Especialidad",
    placeholderLength: 14,
    show: (p) => p?.role_is_medical,
    render: (p) => p?.speciality_name || "No especificado",
  },
  {
    label: "Firma",
    placeholderLength: 14,
    className: "col-span-2",
    show: (p) => p?.role_is_medical,
    render: (p) => p?.signature ? <Image src={p.signature} alt="Firma" width={200} height={200} /> : "No especificado",
  },
];

export default function UserDetailsDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const userId = dialogState?.payload?.user_id as string

  const { data: user, isLoading: isUserLoading } = useGetUserQuery(userId, {
    skip: !userId
  })

  const { data: doctor, isLoading: isDoctorLoading } = useGetDoctorQuery(userId, {
    skip: (!user?.role_is_medical || !userId)
  })

  const onOpenChange = () => {
    closeDialogs()
  }

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState)
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Dialog
      open={dialogState.open === "user-details"}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Detalles del usuario
          </DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>
        <RenderFields
          fields={fields}
          loading={isUserLoading || isDoctorLoading}
          data={{
            ...user!,
            speciality_name: doctor?.specialization_name,
            signature: doctor?.signature,
          }}
        />
        <DialogFooter>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              onClick={() => setDialogsState({ open: 'edit-user', payload: { user_id: userId } })}
            >
              <SquarePen />
              Editar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}