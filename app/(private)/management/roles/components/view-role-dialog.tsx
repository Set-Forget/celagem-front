import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGetRoleQuery } from "@/lib/services/roles";
import { closeDialogs, DialogsState, dialogsStateObservable, setDialogsState } from "@/lib/store/dialogs-store";
import { FieldDefinition } from "@/lib/utils";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { RoleDetail } from "../schema/roles";

const fields: FieldDefinition<RoleDetail>[] = [
  {
    label: "Nombre",
    placeholderLength: 14,
    render: (p) => p?.name || "No especificado",
  },
  {
    label: "Compañía",
    placeholderLength: 14,
    render: (p) => p?.company_name || "No especificado",
  },
  {
    label: "Permisos",
    placeholderLength: 10,
    render: (p) => p?.permissions.map((p) => p.name).join(", ") || "No especificado",
  },
];

export default function ViewRoleDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const roleId = dialogState?.payload?.role_id as string

  const { data: role, isLoading: isRoleLoading } = useGetRoleQuery(roleId, {
    skip: !roleId
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
      open={dialogState.open === "role-details"}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Detalles del rol
          </DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>
        <RenderFields
          fields={fields}
          loading={isRoleLoading}
          data={role}
        />
        <DialogFooter>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              onClick={() => setDialogsState({ open: 'edit-role', payload: { role_id: roleId } })}
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