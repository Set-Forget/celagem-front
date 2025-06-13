import RenderFields from "@/components/render-fields"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGetPaymentMethodQuery } from "@/lib/services/payment-methods"
import { closeDialogs, DialogsState, dialogsStateObservable, setDialogsState } from "@/lib/store/dialogs-store"
import { FieldDefinition } from "@/lib/utils"
import { SquarePen } from "lucide-react"
import { useEffect, useState } from "react"
import { PaymentMethodDetail } from "../schema/payment-methods"
import { paymentTypes } from "../utils"

const fields: FieldDefinition<PaymentMethodDetail>[] = [
  {
    label: "Nombre",
    placeholderLength: 14,
    render: (p) => p?.name || "No especificado",
  },
  {
    label: "Tipo de pago",
    placeholderLength: 14,
    render: (p) => paymentTypes[p?.payment_type] || "No especificado",
  }
];

export default function ViewPaymentMethodDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const paymentMethodId = dialogState?.payload?.payment_method_id as string

  const { data: paymentMethod, isLoading: isPaymentMethodLoading } = useGetPaymentMethodQuery(paymentMethodId, {
    skip: !paymentMethodId
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
      open={dialogState.open === "view-payment-method"}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Detalles del método de pago
          </DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>
        <RenderFields
          fields={fields}
          loading={isPaymentMethodLoading}
          data={paymentMethod}
        />
        <DialogFooter>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              onClick={() => setDialogsState({ open: 'edit-payment-method', payload: { payment_method_id: paymentMethodId } })}
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