import RenderFields from "@/components/render-fields"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { DialogTitle } from "@/components/ui/dialog"
import { DialogDescription } from "@/components/ui/dialog"
import { useGetCompanyQuery } from "@/lib/services/companies"
import { closeDialogs, DialogsState, dialogsStateObservable, setDialogsState } from "@/lib/store/dialogs-store"
import { SquarePen } from "lucide-react"
import { useEffect, useState } from "react"
import { CompanyDetail } from "../schema/companies"
import { FieldDefinition } from "@/lib/utils"

const fields: FieldDefinition<CompanyDetail>[] = [
  {
    label: "Nombre",
    placeholderLength: 14,
    render: (p) => p?.name || "No especificado",
  },
  {
    label: "Descripción",
    placeholderLength: 14,
    render: (p) => p?.description || "No especificado",
  },
];

export default function ViewCompanyDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const companyId = dialogState?.payload?.company_id as string

  const { data: company, isLoading: isCompanyLoading } = useGetCompanyQuery(companyId, {
    skip: !companyId
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
      open={dialogState.open === "company-details"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            Detalles de la compañía
          </DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>
        <RenderFields
          className="!grid-cols-1"
          fields={fields}
          loading={isCompanyLoading}
          data={company}
        />
        <DialogFooter>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              onClick={() => setDialogsState({ open: 'edit-company', payload: { company_id: companyId } })}
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