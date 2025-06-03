import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { useEffect, useState } from "react";

export default function ConfirmPurchaseOrderDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const purchaseOrderId = dialogState.payload?.purchase_order_id

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
      open={dialogState.open === "confirm-billed-po"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="w-[500px] gap-6">
        <DialogHeader>
          <DialogTitle>
            Orden de compra facturada.
          </DialogTitle>
          <DialogDescription>
            La orden de compra seleccionada tiene todos los productos facturados. ¿Desea seleccionarla de todas formas?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenChange}
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={() => {
              window.history.pushState({}, "", `/purchases/bills/new?purchase_order_id=${purchaseOrderId}`);
              onOpenChange();
            }}
          >
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}