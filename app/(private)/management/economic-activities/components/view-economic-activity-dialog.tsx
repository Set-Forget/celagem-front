import RenderFields from "@/components/render-fields"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGetEconomicActivityQuery } from "@/lib/services/economic_activities"
import { closeDialogs, DialogsState, dialogsStateObservable, setDialogsState } from "@/lib/store/dialogs-store"
import { FieldDefinition } from "@/lib/utils"
import { SquarePen } from "lucide-react"
import { useEffect, useState } from "react"
import { EconomicActivityDetail } from "../schema/economic-activities"

const fields: FieldDefinition<EconomicActivityDetail>[] = [
  {
    label: "Nombre",
    placeholderLength: 14,
    render: (p) => p?.name || "No especificado",
  },
  {
    label: "Código",
    placeholderLength: 14,
    render: (p) => p?.code || "No especificado",
  },
];

export default function ViewEconomicActivityDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const economicActivityId = dialogState?.payload?.economic_activity_id as string

  const { data: economicActivity, isLoading: isEconomicActivityLoading } = useGetEconomicActivityQuery(economicActivityId, {
    skip: !economicActivityId
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
      open={dialogState.open === "view-economic-activity"}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Detalles de la actividad económica
          </DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>
        <RenderFields
          fields={fields}
          loading={isEconomicActivityLoading}
          data={economicActivity}
        />
        <DialogFooter>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              onClick={() => setDialogsState({ open: 'edit-economic-activity', payload: { economic_activity_id: economicActivityId } })}
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