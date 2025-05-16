import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useCancelCreditNoteMutation, useConfirmCreditNoteMutation } from "@/lib/services/credit-notes";
import { cn } from "@/lib/utils";
import { Check, CircleX, EditIcon, Ellipsis, FileTextIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { CreditNoteStatus } from "../../schemas/credit-notes";

export default function Actions({ state }: { state?: CreditNoteStatus }) {
  const { id } = useParams<{ id: string }>()

  const [confirmCreditNote, { isLoading: isCreditNoteConfirming }] = useConfirmCreditNoteMutation();
  const [cancelCreditNote, { isLoading: isCreditNoteCancelling }] = useCancelCreditNoteMutation();

  const handleConfirmCreditNote = async () => {
    try {
      const response = await confirmCreditNote({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Nota de crédito confirmada" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al confirmar la nota de crédito" variant="error" />)
    }
  }

  const handleCancelCreditNote = async () => {
    try {
      const response = await cancelCreditNote({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Factura de compra cancelada" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al cancelar la factura de compra" variant="error" />)
    }
  }

  const handleGeneratePDF = async () => {
    const { generateCreditNotePDF } = await import("../../templates/credit-note")
    generateCreditNotePDF()
  }

  if (!state) {
    return null
  }

  if (state === "draft") {
    return (
      <div className="flex gap-2">
        <Dropdown
          trigger={
            <Button size="icon" variant="outline" className="h-8 w-8">
              <Ellipsis />
            </Button>
          }
        >
          <DropdownMenuItem>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => console.log("Editar")}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleCancelCreditNote}
            loading={isCreditNoteCancelling}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isCreditNoteCancelling && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={handleConfirmCreditNote}
          loading={isCreditNoteConfirming}
        >
          <Check className={cn(isCreditNoteConfirming && "hidden")} />
          Confirmar
        </Button>
      </div>
    )
  }

  if (state === "posted") {
    return (
      <div className="flex gap-2">
        <Dropdown
          trigger={
            <Button size="icon" variant="outline" className="h-8 w-8">
              <Ellipsis />
            </Button>
          }
        >
          <DropdownMenuItem onSelect={handleGeneratePDF}>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
          {/* 
            // ! Se deberían poder retornar las notas de crédito/débito a borrador, pero no se puede por el momento.
          */}
        </Dropdown>
      </div>
    )
  }

  /*   if (state === "cancel") {
      return (
        <Button
          size="sm"
          onClick={() => handleUpdateCreditNote("draft")}
          loading={isCreditNoteUpdating}
        >
          <RotateCcw className={cn(isCreditNoteUpdating && "hidden")} />
          Reabrir
        </Button>
      )
    } */

  // ! Falta manejar el estado done.
}