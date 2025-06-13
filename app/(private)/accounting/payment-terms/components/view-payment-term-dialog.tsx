import RenderFields from "@/components/render-fields"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGetTaxQuery } from "@/lib/services/taxes"
import { closeDialogs, DialogsState, dialogsStateObservable, setDialogsState } from "@/lib/store/dialogs-store"
import { FieldDefinition } from "@/lib/utils"
import { SquarePen } from "lucide-react"
import { useEffect, useState } from "react"
import { PaymentTermDetails } from "../schema/payment-terms"
import { useGetPaymentTermQuery } from "@/lib/services/payment-terms"
import { delayTypes } from "../utils"

const fields: FieldDefinition<PaymentTermDetails>[] = [
  {
    label: "Nombre",
    placeholderLength: 14,
    render: (p) => p?.name || "No especificado",
  },
  {
    label: "Vencimiento",
    placeholderLength: 14,
    className: "col-span-2",
    render: (p) => p?.items.map((item) => `${item.nb_days} ${delayTypes[item.delay_type]}`).join(", ") || "No especificado",
  }
];

export default function ViewPaymentTermDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const paymentTermId = dialogState?.payload?.payment_term_id as string

  const { data: paymentTerm, isLoading: isPaymentTermLoading } = useGetPaymentTermQuery(paymentTermId, {
    skip: !paymentTermId
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
      open={dialogState.open === "view-payment-term"}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Detalles del término de pago
          </DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>
        <RenderFields
          fields={fields}
          loading={isPaymentTermLoading}
          data={paymentTerm}
        />
        <DialogFooter>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              onClick={() => setDialogsState({ open: 'edit-payment-term', payload: { payment_term_id: paymentTermId } })}
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