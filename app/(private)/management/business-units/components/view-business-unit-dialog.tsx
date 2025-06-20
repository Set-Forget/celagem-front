import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@/components/ui/dialog";
import { useGetBusinessUnitQuery } from "@/lib/services/business-units";
import { closeDialogs, DialogsState, dialogsStateObservable, setDialogsState } from "@/lib/store/dialogs-store";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { BusinessUnitDetail } from "../schema/business-units";
import { FieldDefinition } from "@/lib/utils";

const fields: FieldDefinition<BusinessUnitDetail>[] = [
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
    label: "Descripción",
    placeholderLength: 14,
    render: (p) => p?.description || "No especificado",
  },
];

export default function ViewBusinessUnitDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })
  const businessUnitId = dialogState?.payload?.business_unit_id as string
  const { data: businessUnit, isLoading: isBusinessUnitLoading } = useGetBusinessUnitQuery(businessUnitId, {
    skip: !businessUnitId
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
      open={dialogState.open === "business-unit-details"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            Detalles de la unidad de negocio
          </DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>
        <RenderFields
          fields={fields}
          loading={isBusinessUnitLoading}
          data={businessUnit}
        />
        <DialogFooter>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              onClick={() => setDialogsState({ open: 'edit-business-unit', payload: { business_unit_id: businessUnitId } })}
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