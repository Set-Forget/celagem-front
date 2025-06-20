import RenderFields from "@/components/render-fields"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGetTaxQuery } from "@/lib/services/taxes"
import { closeDialogs, DialogsState, dialogsStateObservable, setDialogsState } from "@/lib/store/dialogs-store"
import { FieldDefinition } from "@/lib/utils"
import { SquarePen } from "lucide-react"
import { useEffect, useState } from "react"
import { TaxDetail } from "../schema/taxes"
import { taxKinds, taxUseTypes } from "../utils"

const fields: FieldDefinition<TaxDetail>[] = [
  {
    label: "Nombre",
    placeholderLength: 14,
    render: (p) => p?.name || "No especificado",
  },
  {
    label: "Porcentaje",
    placeholderLength: 14,
    render: (p) => p?.amount || "No especificado",
  },
  {
    label: "Tipo de uso",
    placeholderLength: 10,
    render: (p) => taxUseTypes[p?.type_tax_use] || "No especificado",
  },
  {
    label: "Tipo de impuesto",
    placeholderLength: 10,
    render: (p) => taxKinds[p?.tax_kind] || "No especificado",
  },
  {
    label: "Compañía",
    placeholderLength: 10,
    render: (p) => p?.company?.name || "No especificado",
  }
];

export default function TaxDetailsDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const taxId = dialogState?.payload?.tax_id as string

  const { data: tax, isLoading: isTaxLoading } = useGetTaxQuery(taxId, {
    skip: !taxId
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
      open={dialogState.open === "tax-details"}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Detalles del impuesto
          </DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>
        <RenderFields
          fields={fields}
          loading={isTaxLoading}
          data={tax}
        />
        <DialogFooter>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              onClick={() => setDialogsState({ open: 'edit-tax', payload: { tax_id: taxId } })}
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