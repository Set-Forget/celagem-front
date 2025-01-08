import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { Dna, Hospital, Pencil, Stethoscope, Text, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function AppointmentDetailsDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const onOpenChange = () => {
    closeDialogs()
  }

  console.log(dialogState)

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState)

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Dialog
      open={dialogState.open === "appointment-details"}
      onOpenChange={onOpenChange}>
      <DialogContent className="w-fit max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Juan Perez</DialogTitle>
          <DialogDescription>
            Lunes, 30 de diciembre de 2024 - 10:00am a 11:30am
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 mt-2">
          <div className="flex gap-2">
            <Hospital className="h-5 w-5" />
            <span className="text-sm">Sede principal</span>
          </div>
          <div className="flex gap-2">
            <Stethoscope className="h-5 w-5" />
            <span className="text-sm">Dr. Juan Pablo</span>
          </div>
          <div className="flex gap-2">
            <Dna className="h-5 w-5" />
            <Badge
              variant="outline"
              className="w-fit"
            >
              Gestante
            </Badge>
          </div>
          <div className="flex gap-2">
            <Text className="h-5 w-5 shrink-0" />
            <span className="text-sm">Consectetur velit do excepteur est quis duis magna consequat amet irure quis nisi. Ullamco veniam excepteur enim enim irure consectetur sunt commodo cupidatat. Lorem minim ut cillum elit ex pariatur minim laboris Lorem enim.</span>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-between mt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
            >
              <Pencil />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="w-8 h-8"
            >
              <Trash2 />
            </Button>
          </div>
          <Button
            size="sm"
          >
            Ver detalles
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}