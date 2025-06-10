import RenderFields from "@/components/render-fields"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGetUserQuery } from "@/lib/services/users"
import { closeDialogs, DialogsState, dialogsStateObservable, setDialogsState } from "@/lib/store/dialogs-store"
import { FieldDefinition } from "@/lib/utils"
import { SquarePen } from "lucide-react"
import { useEffect, useState } from "react"
import { UserDetail } from "../schema/users"

const fields: FieldDefinition<UserDetail>[] = [
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
];

export default function UserDetailsDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const userId = dialogState?.payload?.user_id as string

  const { data: user, isLoading: isUserLoading } = useGetUserQuery(userId, {
    skip: !userId
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
          loading={isUserLoading}
          data={user}
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