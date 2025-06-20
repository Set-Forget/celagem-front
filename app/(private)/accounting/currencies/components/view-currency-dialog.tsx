import RenderFields from "@/components/render-fields"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGetCurrencyQuery } from "@/lib/services/currencies"
import { closeDialogs, DialogsState, dialogsStateObservable, setDialogsState } from "@/lib/store/dialogs-store"
import { FieldDefinition, formatNumber } from "@/lib/utils"
import { SquarePen } from "lucide-react"
import { useEffect, useState } from "react"
import { CurrencyDetail } from "../schema/currencies"

const fields: FieldDefinition<CurrencyDetail>[] = [
  {
    label: "Nombre",
    placeholderLength: 14,
    render: (p) => p?.name || "No especificado",
  },
  {
    label: "Símbolo",
    placeholderLength: 14,
    render: (p) => p?.symbol || "No especificado",
  },
  {
    label: "Unidad por USD",
    placeholderLength: 10,
    render: (p) => formatNumber(p?.rate || 0) || "No especificado",
  },
];

export default function CurrencyDetailsDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const currencyId = dialogState?.payload?.currency_id as string

  const { data: currency, isLoading: isCurrencyLoading } = useGetCurrencyQuery(currencyId, {
    skip: !currencyId
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
      open={dialogState.open === "currency-details"}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Detalles de la moneda
          </DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>
        <RenderFields
          fields={fields}
          loading={isCurrencyLoading}
          data={currency}
        />
        <DialogFooter>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              onClick={() => setDialogsState({ open: 'edit-currency', payload: { currency_id: currencyId } })}
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