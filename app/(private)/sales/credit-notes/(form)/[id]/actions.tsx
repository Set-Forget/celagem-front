import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Check, CircleX, EditIcon, Ellipsis, FileTextIcon, RotateCcw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateStateMessageMap } from "./utils";
import { useUpdateCreditNoteMutation } from "@/lib/services/credit-notes";

export default function Actions({ state }: { state?: 'draft' | 'posted' | 'cancel' }) {
  const router = useRouter()

  const { id } = useParams<{ id: string }>()

  const [updateCreditNote, { isLoading: isCreditNoteUpdating }] = useUpdateCreditNoteMutation();

  const handleUpdateCreditNote = async (state: 'draft' | 'posted' | 'cancel') => {
    try {
      const response = await updateCreditNote({
        id: Number(id),
        state
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description={updateStateMessageMap[state].success} variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description={updateStateMessageMap[state].error} variant="error" />)
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
            onSelect={() => handleUpdateCreditNote("cancel")}
            loading={isCreditNoteUpdating}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isCreditNoteUpdating && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={() => handleUpdateCreditNote("posted")}
          loading={isCreditNoteUpdating}
        >
          <Check className={cn(isCreditNoteUpdating && "hidden")} />
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

  if (state === "cancel") {
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
  }

  // ! Falta manejar el estado done.
}